<?php
/**
 * Lead form AJAX handler.
 *
 * @package ATRIUM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handle lead submission.
 */
function atrium_handle_lead() {
	check_ajax_referer( 'atrium_lead', 'nonce' );

	$name    = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$phone   = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$consent = ! empty( $_POST['consent'] );

	if ( ! $consent ) {
		wp_send_json_error( array( 'message' => __( 'Нужно согласие на обработку персональных данных.', 'atrium' ) ), 400 );
	}

	if ( '' === $name || '' === $phone ) {
		wp_send_json_error( array( 'message' => __( 'Укажите имя и телефон.', 'atrium' ) ), 400 );
	}

	$to      = atrium_mod( 'atrium_email', get_option( 'admin_email' ) );
	$subject = sprintf( '[ATRIUM] Заявка от %s', $name );
	$body    = "Имя: {$name}\nТелефон: {$phone}\nE-mail: {$email}\n\n{$message}\n";
	$headers = array( 'Content-Type: text/plain; charset=UTF-8' );

	$sent = wp_mail( $to, $subject, $body, $headers );

	if ( ! $sent ) {
		wp_send_json_error( array( 'message' => __( 'Не удалось отправить. Позвоните нам.', 'atrium' ) ), 500 );
	}

	wp_send_json_success( array( 'message' => __( 'Заявка отправлена. Мы свяжемся с вами.', 'atrium' ) ) );
}
add_action( 'wp_ajax_atrium_lead', 'atrium_handle_lead' );
add_action( 'wp_ajax_nopriv_atrium_lead', 'atrium_handle_lead' );

/**
 * Lead form markup.
 *
 * @return string
 */
function atrium_lead_form() {
	$privacy = atrium_mod( 'atrium_privacy', '' );
	if ( ! $privacy ) {
		$privacy_page = get_page_by_path( 'privacy' );
		if ( $privacy_page ) {
			$privacy = get_permalink( $privacy_page );
		}
	}

	ob_start();
	?>
	<form class="lead" data-lead-form novalidate>
		<div class="lead__row">
			<label>
				<span><?php esc_html_e( 'Имя', 'atrium' ); ?></span>
				<input type="text" name="name" required autocomplete="name" />
			</label>
			<label>
				<span><?php esc_html_e( 'Телефон', 'atrium' ); ?></span>
				<input type="tel" name="phone" required autocomplete="tel" />
			</label>
		</div>
		<label>
			<span><?php esc_html_e( 'E-mail', 'atrium' ); ?></span>
			<input type="email" name="email" autocomplete="email" />
		</label>
		<label>
			<span><?php esc_html_e( 'О проекте', 'atrium' ); ?></span>
			<textarea name="message" rows="4" placeholder="<?php esc_attr_e( 'Тип объекта, площадь, сроки', 'atrium' ); ?>"></textarea>
		</label>
		<label class="lead__consent">
			<input type="checkbox" name="consent" value="1" required />
			<span>
				<?php
				if ( $privacy ) {
					printf(
						/* translators: %s: privacy URL */
						wp_kses_post( __( 'Согласен(на) на <a href="%s" target="_blank" rel="noopener">обработку персональных данных</a>', 'atrium' ) ),
						esc_url( $privacy )
					);
				} else {
					esc_html_e( 'Согласен(на) на обработку персональных данных', 'atrium' );
				}
				?>
			</span>
		</label>
		<button type="submit" class="btn btn--light"><?php esc_html_e( 'Отправить заявку', 'atrium' ); ?></button>
		<p class="lead__status" data-lead-status hidden></p>
	</form>
	<?php
	return ob_get_clean();
}
add_shortcode( 'atrium_form', 'atrium_lead_form' );
