<?php
/**
 * Footer.
 *
 * @package ATRIUM
 */
?>
</main>

<footer class="foot">
	<div class="foot__brand">
		<strong>ATRIUM</strong>
		<span><?php echo esc_html( atrium_mod( 'atrium_address', __( 'Санкт-Петербург', 'atrium' ) ) ); ?></span>
	</div>
	<div class="foot__links">
		<a href="mailto:<?php echo esc_attr( atrium_mod( 'atrium_email', get_option( 'admin_email' ) ) ); ?>">
			<?php echo esc_html( atrium_mod( 'atrium_email', get_option( 'admin_email' ) ) ); ?>
		</a>
		<?php
		$privacy = atrium_mod( 'atrium_privacy', '' );
		if ( ! $privacy ) {
			$page = get_page_by_path( 'privacy' );
			if ( $page ) {
				$privacy = get_permalink( $page );
			}
		}
		if ( $privacy ) :
			?>
			<a href="<?php echo esc_url( $privacy ); ?>"><?php esc_html_e( 'Политика ПДн', 'atrium' ); ?></a>
		<?php endif; ?>
	</div>
	<p class="foot__note"><?php esc_html_e( 'Учебное демо-тема WordPress для портфолио.', 'atrium' ); ?></p>
</footer>
<?php wp_footer(); ?>
</body>
</html>
