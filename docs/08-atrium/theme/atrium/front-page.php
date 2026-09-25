<?php
/**
 * Front page template.
 *
 * @package ATRIUM
 */

get_header();

$tagline = atrium_mod( 'atrium_tagline', __( 'Архитектура света и тишины', 'atrium' ) );
$lead    = atrium_mod( 'atrium_lead', __( 'Проектируем частные дома и интерьеры, где пространство дышит медленнее города.', 'atrium' ) );
$phone   = atrium_mod( 'atrium_phone', '+7 (812) 000-00-00' );
?>

<section class="hero" id="hero">
	<div class="hero__media" aria-hidden="true">
		<img
			src="<?php echo esc_url( ATRIUM_URI . '/assets/img/hero.jpg' ); ?>"
			alt=""
			width="1920"
			height="1080"
			fetchpriority="high"
			onerror="this.style.display='none'"
		/>
		<div class="hero__fallback"></div>
	</div>
	<div class="hero__shade"></div>
	<div class="hero__copy">
		<p class="brand-mark">ATRIUM</p>
		<h1><?php echo esc_html( $tagline ); ?></h1>
		<p class="hero__lead"><?php echo esc_html( $lead ); ?></p>
		<div class="hero__cta">
			<a class="btn btn--light" href="#contact"><?php esc_html_e( 'Обсудить участок', 'atrium' ); ?></a>
			<a class="btn btn--ghost" href="#projects"><?php esc_html_e( 'Смотреть проекты', 'atrium' ); ?></a>
		</div>
	</div>
	<p class="hero__scroll" aria-hidden="true"><?php esc_html_e( 'Листать', 'atrium' ); ?></p>
</section>

<section class="intro" id="method">
	<div class="intro__grid">
		<p class="eyebrow"><?php esc_html_e( 'Метод', 'atrium' ); ?></p>
		<h2><?php esc_html_e( 'Один объём. Один свет. Никакой декоративной суеты.', 'atrium' ); ?></h2>
		<p class="intro__text">
			<?php esc_html_e( 'Мы начинаем с ориентации по солнцу и маршрутов человека в доме. Материалы — камень, дерево, металл — выбираются так, чтобы стареть красиво, а не «выглядеть дорого» в первый сезон.', 'atrium' ); ?>
		</p>
	</div>
	<ol class="steps">
		<li>
			<span>01</span>
			<strong><?php esc_html_e( 'Сценарий', 'atrium' ); ?></strong>
			<p><?php esc_html_e( 'Бриф, участок, ограничения. Фиксируем задачу одной фразой.', 'atrium' ); ?></p>
		</li>
		<li>
			<span>02</span>
			<strong><?php esc_html_e( 'Объём', 'atrium' ); ?></strong>
			<p><?php esc_html_e( 'Концепция и свет. Макет, который можно оспорить за час.', 'atrium' ); ?></p>
		</li>
		<li>
			<span>03</span>
			<strong><?php esc_html_e( 'Деталь', 'atrium' ); ?></strong>
			<p><?php esc_html_e( 'Рабочая документация и авторский надзор до сдачи.', 'atrium' ); ?></p>
		</li>
	</ol>
</section>

<section class="projects" id="projects">
	<div class="section-head">
		<p class="eyebrow"><?php esc_html_e( 'Портфолио', 'atrium' ); ?></p>
		<h2><?php esc_html_e( 'Избранные объекты', 'atrium' ); ?></h2>
	</div>
	<div class="projects__grid">
		<?php
		$query = new WP_Query(
			array(
				'post_type'      => 'atrium_project',
				'posts_per_page' => 6,
				'post_status'    => 'publish',
			)
		);

		if ( $query->have_posts() ) :
			while ( $query->have_posts() ) :
				$query->the_post();
				get_template_part( 'template-parts/content', 'project' );
			endwhile;
			wp_reset_postdata();
		else :
			// Demo cards when CPT is empty — portfolio-ready out of the box.
			$demos = array(
				array(
					'title' => __( 'Дом у залива', 'atrium' ),
					'meta'  => '2024 · 280 м² · Курортный',
					'img'   => 'project-1.jpg',
				),
				array(
					'title' => __( 'Квартира-галерея', 'atrium' ),
					'meta'  => '2025 · 142 м² · Центр',
					'img'   => 'project-2.jpg',
				),
				array(
					'title' => __( 'Павильон в лесу', 'atrium' ),
					'meta'  => '2023 · 96 м² · Карелия',
					'img'   => 'project-3.jpg',
				),
			);
			foreach ( $demos as $i => $demo ) :
				?>
				<article class="project-card">
					<a class="project-card__link" href="#contact">
						<div class="project-card__media tone-<?php echo esc_attr( (string) ( $i + 1 ) ); ?>">
							<span class="project-card__index">0<?php echo esc_html( (string) ( $i + 1 ) ); ?></span>
						</div>
						<div class="project-card__body">
							<h3><?php echo esc_html( $demo['title'] ); ?></h3>
							<p><?php echo esc_html( $demo['meta'] ); ?></p>
						</div>
					</a>
				</article>
				<?php
			endforeach;
		endif;
		?>
	</div>
</section>

<section class="statement">
	<blockquote>
		<p><?php esc_html_e( 'Хороший дом не кричит о бюджете. Он держит тишину и правильный свет в четыре часа дня.', 'atrium' ); ?></p>
		<cite>ATRIUM</cite>
	</blockquote>
</section>

<section class="contact" id="contact">
	<div class="contact__copy">
		<p class="eyebrow"><?php esc_html_e( 'Заявка', 'atrium' ); ?></p>
		<h2><?php esc_html_e( 'Расскажите о участке или объекте', 'atrium' ); ?></h2>
		<p><?php esc_html_e( 'Ответим в течение одного рабочего дня. Первый созвон — 30 минут, без коммерческого давления.', 'atrium' ); ?></p>
		<a class="contact__phone" href="tel:<?php echo esc_attr( preg_replace( '/\D+/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
	</div>
	<div class="contact__form">
		<?php echo atrium_lead_form(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</section>

<?php
get_footer();
