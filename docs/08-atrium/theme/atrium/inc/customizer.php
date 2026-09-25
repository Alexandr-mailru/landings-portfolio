<?php
/**
 * Theme Customizer.
 *
 * @package ATRIUM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register settings.
 *
 * @param WP_Customize_Manager $wp_customize Customizer.
 */
function atrium_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'atrium_brand',
		array(
			'title'    => __( 'ATRIUM — бренд и контакты', 'atrium' ),
			'priority' => 30,
		)
	);

	$fields = array(
		'atrium_tagline'   => array( 'label' => __( 'Слоган в герое', 'atrium' ), 'default' => __( 'Архитектура света и тишины', 'atrium' ), 'type' => 'textarea' ),
		'atrium_lead'      => array( 'label' => __( 'Подзаголовок', 'atrium' ), 'default' => __( 'Проектируем частные дома и интерьеры, где пространство дышит медленнее города.', 'atrium' ), 'type' => 'textarea' ),
		'atrium_phone'     => array( 'label' => __( 'Телефон', 'atrium' ), 'default' => '+7 (812) 000-00-00', 'type' => 'text' ),
		'atrium_email'     => array( 'label' => __( 'E-mail заявок', 'atrium' ), 'default' => get_option( 'admin_email' ), 'type' => 'email' ),
		'atrium_address'   => array( 'label' => __( 'Адрес', 'atrium' ), 'default' => __( 'Санкт-Петербург', 'atrium' ), 'type' => 'text' ),
		'atrium_privacy'   => array( 'label' => __( 'URL политики ПДн', 'atrium' ), 'default' => '', 'type' => 'url' ),
	);

	foreach ( $fields as $id => $args ) {
		if ( 'atrium_email' === $id ) {
			$sanitize = 'sanitize_email';
		} elseif ( 'url' === $args['type'] ) {
			$sanitize = 'esc_url_raw';
		} elseif ( 'textarea' === $args['type'] ) {
			$sanitize = 'sanitize_textarea_field';
		} else {
			$sanitize = 'sanitize_text_field';
		}

		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $args['default'],
				'sanitize_callback' => $sanitize,
			)
		);
		$wp_customize->add_control(
			$id,
			array(
				'label'   => $args['label'],
				'section' => 'atrium_brand',
				'type'    => $args['type'],
			)
		);
	}
}
add_action( 'customize_register', 'atrium_customize_register' );
