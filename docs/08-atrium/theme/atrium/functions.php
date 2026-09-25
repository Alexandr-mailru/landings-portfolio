<?php
/**
 * ATRIUM theme bootstrap.
 *
 * @package ATRIUM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ATRIUM_VERSION', '1.0.0' );
define( 'ATRIUM_DIR', get_template_directory() );
define( 'ATRIUM_URI', get_template_directory_uri() );

require_once ATRIUM_DIR . '/inc/cpt.php';
require_once ATRIUM_DIR . '/inc/customizer.php';
require_once ATRIUM_DIR . '/inc/forms.php';

/**
 * Theme setup.
 */
function atrium_setup() {
	load_theme_textdomain( 'atrium', ATRIUM_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 240,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );

	add_image_size( 'atrium-hero', 1920, 1080, true );
	add_image_size( 'atrium-card', 900, 1200, true );
	add_image_size( 'atrium-wide', 1400, 900, true );

	register_nav_menus(
		array(
			'primary' => __( 'Главное меню', 'atrium' ),
			'footer'  => __( 'Меню в подвале', 'atrium' ),
		)
	);
}
add_action( 'after_setup_theme', 'atrium_setup' );

/**
 * Enqueue assets.
 */
function atrium_assets() {
	wp_enqueue_style(
		'atrium-fonts',
		'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'atrium-main',
		ATRIUM_URI . '/assets/css/main.css',
		array( 'atrium-fonts' ),
		ATRIUM_VERSION
	);

	wp_enqueue_script(
		'atrium-main',
		ATRIUM_URI . '/assets/js/main.js',
		array(),
		ATRIUM_VERSION,
		true
	);

	wp_localize_script(
		'atrium-main',
		'atriumData',
		array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'atrium_lead' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'atrium_assets' );

/**
 * Body classes.
 *
 * @param array $classes Classes.
 * @return array
 */
function atrium_body_classes( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'is-front';
	}
	return $classes;
}
add_filter( 'body_class', 'atrium_body_classes' );

/**
 * Fallback menu.
 */
function atrium_fallback_menu() {
	echo '<ul class="nav__list">';
	echo '<li><a href="' . esc_url( home_url( '/#projects' ) ) . '">' . esc_html__( 'Проекты', 'atrium' ) . '</a></li>';
	echo '<li><a href="' . esc_url( home_url( '/#method' ) ) . '">' . esc_html__( 'Метод', 'atrium' ) . '</a></li>';
	echo '<li><a href="' . esc_url( home_url( '/#contact' ) ) . '">' . esc_html__( 'Заявка', 'atrium' ) . '</a></li>';
	echo '</ul>';
}

/**
 * Helper: theme mod with default.
 *
 * @param string $key Key.
 * @param mixed  $default Default.
 * @return mixed
 */
function atrium_mod( $key, $default = '' ) {
	return get_theme_mod( $key, $default );
}
