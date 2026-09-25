<?php
/**
 * Page template.
 *
 * @package ATRIUM
 */

get_header();
?>
<section class="legal">
	<?php while ( have_posts() ) : ?>
		<?php the_post(); ?>
		<article <?php post_class(); ?>>
			<h1><?php the_title(); ?></h1>
			<?php the_content(); ?>
		</article>
	<?php endwhile; ?>
</section>
<?php
get_footer();
