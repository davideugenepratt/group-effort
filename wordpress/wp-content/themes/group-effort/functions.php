<?php

add_action( 'after_setup_theme', 'formation_setup' );

function formation_setup() {
	load_theme_textdomain( 'formation', get_template_directory() . '/languages' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );

	register_nav_menus(
		array( 'main-menu' => __( 'Main Menu', 'formation' ) )
	);
	
}

add_action( 'wp_enqueue_scripts', 'formation_load_scripts' );

function formation_load_scripts() {
	wp_register_script( 'bootstrap-script', get_template_directory_uri() . '/bootstrap/javascripts/bootstrap.js', array( 'jquery' ) );
	wp_enqueue_script( 'bootstrap-script' );
}

add_action( 'comment_form_before', 'formation_enqueue_comment_reply_script' );

function formation_enqueue_comment_reply_script() {
	if ( get_option( 'thread_comments' ) ) { 
		wp_enqueue_script( 'comment-reply' ); 
	}
}

add_filter( 'the_title', 'formation_title' );

function formation_title( $title ) {
	if ( $title == '' ) {
		return '&rarr;';
	} else {
		return $title;
	}
}

add_filter( 'wp_title', 'formation_filter_wp_title' );

function formation_filter_wp_title( $title ) {
	return $title . esc_attr( get_bloginfo( 'name' ) );
}

add_action( 'widgets_init', 'formation_widgets_init' );

function formation_widgets_init() {
	register_sidebar( array (
		'name' => __( 'Sidebar Widget Area', 'formation' ),
		'id' => 'primary-widget-area',
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => "</li>",
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
}

function formation_custom_pings( $comment ) {
	$GLOBALS['comment'] = $comment;
	?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php echo comment_author_link(); ?></li>
	<?php 
}

add_filter( 'get_comments_number', 'formation_comments_number' );

function formation_comments_number( $count ) {
	if ( !is_admin() ) {
		global $id;
		$comments_by_type = &separate_comments( get_comments( 'status=approve&post_id=' . $id ) );
		return count( $comments_by_type['comment'] );
	} else {
		return $count;
	}
}

function formation_add_slug_body_class( $classes ) {
	global $post;
	if ( isset( $post ) ) {
		$classes[] = $post->post_type . '-' . $post->post_name;
	}
	return $classes;
}
	
add_filter( 'body_class', 'formation_add_slug_body_class' );

function formation_gallery_shortcode( $output = '', $atts, $content = false, $tag = false ) {
	$return = $output; // fallback
	$ids = explode( ',' , $atts['ids'] );		
	$controls_html = '';
	$images = '';
	foreach ( $ids as $key => $id ) {
		$active = '';
		if ( $key == 0 ) { $active = 'active';  }
		$controls_html .= '<li data-target="#case-study-carousel" data-slide-to="'.$key.'" class="'.$active.'"></li>';
		$image_url = wp_get_attachment_image_src( $id, 'full' );
		$image_info = wp_prepare_attachment_for_js( $id ) ;
		//var_dump( $image_info );
		//echo '<br><br>';
		$images .= '<div class="item '.$active.'"><img src="'.$image_url[0].'" alt="'.$image_info["title"].'"><div class="carousel-caption"><h1>'.$image_info["title"].'</h1>'.$image_info["caption"].'</div></div>';		
	}	
	if ( !isset( $dep_site_gallery_id ) ) {
		$dep_site_gallery_id = 0;
	} else {
		$dep_site_gallery_id++;	
	}	
	ob_start();
	?>
	<div class="row">
		<div class="col-xs-12">
			<div id="case-study-carousel-<?php echo $dep_site_gallery_id; ?>" class="carousel carousel-fade" data-interval="3000" data-ride="carousel">
              <ol class="carousel-indicators">
                <?php echo $controls_html; ?>
              </ol>
              <div class="carousel-inner">
                <?php echo $images; ?>
              </div>
              <a class="left carousel-control" href="#case-study-carousel-<?php echo $dep_site_gallery_id; ?>" role="button" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
              </a>
              <a class="right carousel-control" href="#case-study-carousel-<?php echo $dep_site_gallery_id; ?>" role="button" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
              </a>
			</div>
		</div>
	</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	$my_result = $output;
	if( !empty( $my_result ) ) {
		$return = $my_result;
	}
	return $return;
}

add_filter( 'post_gallery', 'formation_gallery_shortcode', 10, 4 );

add_action( 'widgets_init', 'formation_contact_widgets_init' );

function formation_contact_widgets_init() {
	include('widgets/Formation_Contact_Widget.php');
	register_widget( 'Formation_Contact_Widget' );
	
	include('widgets/Formation_Social_Widget.php');
	register_widget( 'Formation_Social_Widget' );	
}

add_filter('dynamic_sidebar_params','custom_widget_counter');

function custom_widget_counter( $params ) {

	global $my_widget_num;

	$my_widget_num++;
	$class = 'class="widget-' . $my_widget_num . ' ';

	if($my_widget_num % 2) :
		$class .= 'widget-even ';
		$class .= 'widget-alt ';
	else :
		$class .= 'widget-odd ';
	endif;

	$params[0]['before_widget'] = str_replace('class="', $class, $params[0]['before_widget']);

	return $params;
}