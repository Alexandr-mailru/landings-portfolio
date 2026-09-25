<?php
/**
 * Custom post type: Projects.
 *
 * @package ATRIUM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register CPT and taxonomy.
 */
function atrium_register_cpt() {
	$labels = array(
		'name'          => __( 'Проекты', 'atrium' ),
		'singular_name' => __( 'Проект', 'atrium' ),
		'add_new_item'  => __( 'Добавить проект', 'atrium' ),
		'edit_item'     => __( 'Редактировать проект', 'atrium' ),
		'view_item'     => __( 'Смотреть проект', 'atrium' ),
		'search_items'  => __( 'Искать проекты', 'atrium' ),
		'not_found'     => __( 'Проектов нет', 'atrium' ),
	);

	register_post_type(
		'atrium_project',
		array(
			'labels'       => $labels,
			'public'       => true,
			'has_archive'  => true,
			'rewrite'      => array( 'slug' => 'projects' ),
			'menu_icon'    => 'dashicons-building',
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'show_in_rest' => true,
		)
	);

	register_taxonomy(
		'atrium_typology',
		'atrium_project',
		array(
			'label'        => __( 'Типология', 'atrium' ),
			'public'       => true,
			'hierarchical' => true,
			'rewrite'      => array( 'slug' => 'typology' ),
			'show_in_rest' => true,
		)
	);
}
add_action( 'init', 'atrium_register_cpt' );

/**
 * Project meta boxes.
 */
function atrium_project_meta_boxes() {
	add_meta_box(
		'atrium_project_meta',
		__( 'Параметры проекта', 'atrium' ),
		'atrium_project_meta_render',
		'atrium_project',
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes', 'atrium_project_meta_boxes' );

/**
 * Render meta fields.
 *
 * @param WP_Post $post Post.
 */
function atrium_project_meta_render( $post ) {
	wp_nonce_field( 'atrium_project_meta', 'atrium_project_meta_nonce' );
	$year     = get_post_meta( $post->ID, '_atrium_year', true );
	$area     = get_post_meta( $post->ID, '_atrium_area', true );
	$location = get_post_meta( $post->ID, '_atrium_location', true );
	?>
	<p>
		<label for="atrium_year"><?php esc_html_e( 'Год', 'atrium' ); ?></label><br />
		<input type="text" class="widefat" id="atrium_year" name="atrium_year" value="<?php echo esc_attr( $year ); ?>" />
	</p>
	<p>
		<label for="atrium_area"><?php esc_html_e( 'Площадь', 'atrium' ); ?></label><br />
		<input type="text" class="widefat" id="atrium_area" name="atrium_area" value="<?php echo esc_attr( $area ); ?>" placeholder="240 м²" />
	</p>
	<p>
		<label for="atrium_location"><?php esc_html_e( 'Локация', 'atrium' ); ?></label><br />
		<input type="text" class="widefat" id="atrium_location" name="atrium_location" value="<?php echo esc_attr( $location ); ?>" />
	</p>
	<?php
}

/**
 * Save meta.
 *
 * @param int $post_id ID.
 */
function atrium_project_meta_save( $post_id ) {
	if ( ! isset( $_POST['atrium_project_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['atrium_project_meta_nonce'] ) ), 'atrium_project_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$fields = array( 'atrium_year', 'atrium_area', 'atrium_location' );
	foreach ( $fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, '_' . $field, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
		}
	}
}
add_action( 'save_post_atrium_project', 'atrium_project_meta_save' );
