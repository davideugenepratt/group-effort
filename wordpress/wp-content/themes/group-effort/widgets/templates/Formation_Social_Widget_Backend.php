<?php

$all_services = array(
				  'mail' => 'Email',
				  'telephone' => 'Phone',
				  'home' => 'Address',
				  'social-500px' => '500px',
				  'social-adobe' => 'Adobe',
				  'social-amazon' => 'Amazon',
				  'social-android' => 'Android',
				  'social-apple' => 'Apple',
				  'social-behance' => 'Behance',
				  'social-bing' => 'Bing',
				  'social-blogger' => 'Blogger',
				  'social-delicious' => 'Delicious',
				  'social-designer-news' => 'Designer News',
				  'social-deviant-art' => 'Deviant Art',
				  'social-digg' => 'Digg',
				  'social-dribbble' => 'Dribbble',
				  'social-drive' => 'Drive',
				  'social-dropbox' => 'Dropbox',
				  'social-evernote' => 'Evernote',
				  'social-facebook' => 'Facebook',
				  'social-flickr' => 'Flickr',
				  'social-forrst' => 'Forrst',
				  'social-foursquare' => 'Foursquare',
				  'social-game-center' => 'Game Center',
				  'social-github' => 'Github',
				  'social-google-plus' => 'Google+',
				  'social-hacker-news' => 'Hacker News',
				  'social-hi5' => 'Hi5',
				  'social-instagram' => 'Instagram',
				  'social-joomla' => 'Joomla',
				  'social-lastfm' => 'LastFM',
				  'social-linkedin' => 'LinkedIn',
				  'social-medium' => 'Medium',
				  'social-myspace' => 'Myspace',
				  'social-orkut' => 'Orkut',
				  'social-path' => 'Path',
				  'social-picasa' => 'Picasa',
				  'social-pinterest' => 'Pinterest',
				  'social-rdio' => 'Rdio',
				  'social-reddit' => 'Reddit',
				  'social-skype' => 'Skype',
				  'social-skillshare' => 'Skillshare',
				  'social-smashing-mag' => 'Smashing Magazine',
				  'social-snapchat' => 'Snapchat',
				  'social-spotify' => 'Spotify',
				  'social-squidoo' => 'Squidoo',
				  'social-stack-overflow' => 'Stack Overflow',
				  'social-steam' => 'Steam',
				  'social-stumbleupon' => 'StumbleUpon',
				  'social-treehouse' => 'Treehouse',
				  'social-tumblr' => 'Tumblr',
				  'social-twitter' => 'Twitter',
				  'social-vimeo' => 'Vimeo',
				  'social-windows' => 'Microsoft',
				  'social-xbox' => 'Xbox',
				  'social-yahoo' => 'Yahoo!',
				  'social-yelp' => 'Yelp',
				  'social-youtube' => 'Youtube',
				  'social-zerply' => 'Zerply'
				  
				  );


?>
<div class="Formation_Social_widget_container">
	<div class="formation_social_title">
        <label for="<?php echo $this->get_field_name( 'title' ); ?>">
        	Title: 
        	<input type="text" class="widefat" name="<?php echo $this->get_field_name( 'title' ); ?>"  value="<?php echo esc_attr( $instance[ 'title' ] ); ?>">       
        </label>
    </div>
    <div class="formation_social_table">
    	<div class="selector">
            <select class="widefat formation_social_selector">
            	<option selected disabled>Add a service ...</option>
                <?php 
                foreach ( $all_services as $key => $service ) {
                    echo '<option value="'.$key.'">'.$service.'</option>';					
                }
                ?>
            </select>            	
		</div>
        <?php
		$services = json_decode( $instance[ 'services' ] );
		$hidden = 'hidden';
		$tbody = '';
		
		if ( !empty( $services ) ) {		
			$hidden = '';			
			foreach ( $services as $service ) {			
				$tbody .= '<tr class="'.$service[0].'"><td class="icon_cell"><a href="#" class="delete_service"><i class="fi-x"></i></a></td><td  class="icon_cell"><i class="service_icon fi-'.$service[0].'"></i></td><td><input type="text" class="widefat caption" value="'.$service[1].'"></td><td><input type="text" class="widefat link" value="'.$service[2].'"></td></tr>';			
			}
		
		}
	
		?>
    	<table class="wp-list-table widefat fixed tags fields-table <?php echo $hidden; ?>">
        	<thead>
            	<tr class="no-fields">
                	<th class="manage-column column-delete icon_cell" ></th>
                    <th class="manage-column column-name icon_cell"></th>
                    <th class="manage-column column-type ">Caption</th>
                    <th class="manage-column column-type ">Link</th>
                </tr>
            </thead>
            <tfoot>
            	<tr class="no-fields">
                	<th class="manage-column column-delete icon_cell"></th>
                    <th class="manage-column column-name icon_cell"></th>
                    <th class="manage-column column-type">Caption</th>
                    <th class="manage-column column-type">Link</th>         
                </tr>
            </tfoot>
            <tbody>
            <?php echo $tbody; ?>
            </tbody>
    	</table>
        <input type="hidden" name="<?php echo $this->get_field_name( 'services' ); ?>" class="all_services" value="<?php echo esc_attr( $instance[ 'services' ] ); ?>" />
    </div>
</div>
