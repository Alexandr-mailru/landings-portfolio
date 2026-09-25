<?php
/**
 * Single project.
 *
 * @package ATRIUM
 */

get_header();

while ( have_posts() ) :
	the_post();
	$year     = get_post_meta( get_the_ID(), '_atrium_year', true );
	$area     = get_post_meta( get_the_ID(), '_atrium_area', true );
	$location = get_post_meta( get_the_ID(), '_atrium_location', true );
	?>
	<article <?php post_class( 'project-single' ); ?>>
		<header class="project-single__head">
			<p class="eyebrow"><?php esc_html_e( 'Проект', 'atrium' ); ?></p>
			<h1><?php the_title(); ?></h1>
			<ul class="project-single__meta">
				<?php if ( $year ) : ?><li><?php echo esc_html( $year ); ?></li><?php endif; ?>
				<?php if ( $area ) : ?><li><?php echo esc_html( $area ); ?></li><?php endif; ?>
				<?php if ( $location ) : ?><li><?php echo esc_html( $location ); ?></li><?php endif; ?>
			</ul>
		</header>
		<?php if ( has_post_thumbnail() ) : ?>
			<figure class="project-single__hero">
				<?php the_post_thumbnail( 'atrium-wide' ); ?>
			</figure>
		<?php endif; ?>
		<div class="project-single__content">
			<?php the_content(); ?>
		</div>
		<p class="project-single__back">
			<a href="<?php echo esc_url( home_url( '/#projects' ) ); ?>"><?php esc_html_e( '← Все проекты', 'atrium' ); ?></a>
		</p>
	</article>
	<?php
endwhile;

get_footer();
