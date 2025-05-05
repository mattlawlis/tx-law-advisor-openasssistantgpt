<?php
/*
 * Plugin Name: TLA AI Wallet
 * Description: Simple credits ledger + gating for the AI iframe.
 * Version:     0.2
 * Author:      You
 */

// 1) REST ENDPOINTS: balance and debit
add_action('rest_api_init', function() {
    register_rest_route('tlas/v1','/balance', [
        'methods'  => 'GET',
        'callback' => 'tlas_get_balance',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('tlas/v1','/debit', [
        'methods'  => 'POST',
        'callback' => 'tlas_debit',
        'permission_callback' => '__return_true',
    ]);
});

function tlas_get_balance($req) {
    if ( ! is_user_logged_in() ) {
        return new WP_Error('rest_forbidden','Not authenticated',['status'=>401]);
    }
    $user_id = get_current_user_id();
    $bal     = (int) get_user_meta($user_id,'tlas_ai_credits',true);
    return rest_ensure_response(['balance'=>$bal]);
}

function tlas_debit($req) {
    if ( ! is_user_logged_in() ) {
        return new WP_Error('rest_forbidden','Not authenticated',['status'=>401]);
    }
    $user_id = get_current_user_id();
    $amount  = (int) $req->get_param('amount');
    $bal     = (int) get_user_meta($user_id,'tlas_ai_credits',true);
    if ($bal < $amount) {
        return new WP_Error('insufficient','Not enough credits', ['status'=>402]);
    }
    update_user_meta($user_id,'tlas_ai_credits',$bal - $amount);
    return rest_ensure_response(['balance'=>$bal - $amount]);
}

// 2) ADMIN UI: simple menu to credit tokens manually
add_action('admin_menu', function() {
    add_users_page(
        'AI Wallet Credits',
        'AI Wallet',
        'edit_users',
        'tlas-ai-wallet',
        'tlas_admin_page'
    );
});

function tlas_admin_page() {
    if (!current_user_can('edit_users')) return;
    // handle form submit
    if ( isset($_POST['tlas_credit_user'], $_POST['tlas_credit_amount']) 
         && check_admin_referer('tlas_credit_action') ) {
        $uid = intval($_POST['tlas_credit_user']);
        $amt = intval($_POST['tlas_credit_amount']);
        $bal = (int) get_user_meta($uid,'tlas_ai_credits',true);
        update_user_meta($uid,'tlas_ai_credits',$bal + $amt);
        echo '<div class="updated"><p>Credited '.esc_html($amt).' tokens to user #'.esc_html($uid).'.</p></div>';
    }
    // form
    $users = get_users(['fields'=>['ID','user_login']]);
    ?>
    <div class="wrap">
      <h1>AI Wallet – Credit Users</h1>
      <form method="post">
        <?php wp_nonce_field('tlas_credit_action'); ?>
        <table class="form-table">
          <tr>
            <th><label for="tlas_credit_user">User</label></th>
            <td>
              <select name="tlas_credit_user" id="tlas_credit_user">
                <?php foreach($users as $u): ?>
                  <option value="<?php echo esc_attr($u->ID); ?>">
                    <?php echo esc_html($u->user_login . ' (ID:' . $u->ID . ')'); ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </td>
          </tr>
          <tr>
            <th><label for="tlas_credit_amount">Amount</label></th>
            <td><input type="number" name="tlas_credit_amount" id="tlas_credit_amount" value="0" /></td>
          </tr>
        </table>
        <?php submit_button('Credit Tokens'); ?>
      </form>
    </div>
    <?php
}

// 3) SHORTCODE to show balance & “buy more” link
add_shortcode('ai_wallet_status', function() {
    if ( ! is_user_logged_in() ) {
        return '<p>Please <a href="'.wp_login_url().'?redirect_to='.urlencode($_SERVER['REQUEST_URI']).'">log in</a> to access AI.</p>';
    }
    $bal = (int) get_user_meta(get_current_user_id(),'tlas_ai_credits',true);
    if ( $bal <= 0 ) {
        return '<p><strong>0 tokens</strong>. Please contact us to purchase more.</p>';
    }
    return "<p>You have <strong>{$bal} tokens</strong> remaining.</p>";
});