<?php
/**
 * Header.
 *
 * @package ATRIUM
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip" href="#main"><?php esc_html_e( 'К содержанию', 'atrium' ); ?></a>

<header class="top" data-top>
	<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
		<?php
		if ( has_custom_logo() ) {
			the_custom_logo();
		} else {
			echo '<span class="brand__mark">ATRIUM</span>';
		}
		?>
	</a>
	<nav class="nav" aria-label="<?php esc_attr_e( 'Главное', 'atrium' ); ?>">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => 'nav__list',
				'fallback_cb'    => 'atrium_fallback_menu',
				'depth'          => 1,
			)
		);
		?>
	</nav>
	<a class="top__phone" href="tel:<?php echo esc_attr( preg_replace( '/\D+/', '', atrium_mod( 'atrium_phone', '' ) ) ); ?>">
		<?php echo esc_html( atrium_mod( 'atrium_phone', '+7 (812) 000-00-00' ) ); ?>
	</a>
	<button type="button" class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="mobile-nav">
		<span></span><span></span>
		<span class="visually-hidden"><?php esc_html_e( 'Меню', 'atrium' ); ?></span>
	</button>
</header>

<div class="mobile-nav" id="mobile-nav" data-mobile-nav hidden>
	<?php
	wp_nav_menu(
		array(
			'theme_location' => 'primary',
			'container'      => false,
			'menu_class'     => 'mobile-nav__list',
			'fallback_cb'    => 'atrium_fallback_menu',
			'depth'          => 1,
		)
	);
	?>
</div>

<main id="main">
