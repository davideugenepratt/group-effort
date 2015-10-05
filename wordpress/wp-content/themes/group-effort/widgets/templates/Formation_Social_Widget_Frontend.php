<?php
$services = json_decode( $instance[ 'services'] );

echo $args['before_widget'];

if ( $instance['title'] != '' ) {
	echo '<h2 class="widget-title">'.$instance['title'].'</h2>';	
}

foreach ( $services as $service ) {
	$link_beg = '';
	$link_end = '';
	if ( $service[2] != '' ) {
		$link_beg = '<a href="'.$service[2].'">';
		$link_end = '</a>';
	}
	echo '<div class="formation_social_service">'.$link_beg.'<span class="formation_social_icon"><i class="service_icon fi-'.$service[0].'"></i></span><span class="formation_social_caption">'.$service[1].'</span>'.$link_end.'</div>';
}




echo $args['after_widget'];
?>
