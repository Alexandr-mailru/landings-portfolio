<?php
/**
 * Project card.
 *
 * @package ATRIUM
 */

$year     = get_post_meta( get_the_ID(), '_atrium_year', true );
$area     = get_post_meta( get_the_ID(), '_atrium_area', true );
$location = get_post_meta( get_the_ID(), '_atrium_location', true );
$meta     = array_filter( array( $year, $area, $location ) );
?>
<article <?php post_class( 'project-card' ); ?>>
	<a class="project-card__link" href="<?php the_permalink(); ?>">
		<div class="project-card__media">
			<?php
			if ( has_post_thumbnail() ) {
				the_post_thumbnail( 'atrium-card' );
			}
			?>
			<span class="project-card__index"><?php echo esc_html( str_pad( (string) ( $wp_query->current_post + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
		</div>
		<div class="project-card__body">
			<h3><?php the_title(); ?></h3>
			<?php if ( $meta ) : ?>
				<p><?php echo esc_html( implode( ' · ', $meta ) ); ?></p>
			<?php elseif ( has_excerpt() ) : ?>
				<p><?php echo esc_html( get_the_excerpt() ); ?></p>
			<?php endif; ?>
		</div>
	</a>
</article>
