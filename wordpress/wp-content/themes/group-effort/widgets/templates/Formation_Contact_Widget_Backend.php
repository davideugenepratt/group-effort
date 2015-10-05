<div class="formation_contact_wrapper" >
	<div class="formation_contact_title_container">
        <label for="<?php echo $this->get_field_name( 'title' ); ?>">
            Title: 
            <input type="text" class="widefat" name="<?php echo $this->get_field_name( 'title' ); ?>"  value="<?php echo esc_attr( $instance[ 'title' ] ); ?>">       
        </label>
        
    </div>
    <div class="formation_contact_email_container">
        <label for="<?php echo $this->get_field_name( 'email' ); ?>">
            E-Mail:       
            <input type="text" class="widefat" name="<?php echo $this->get_field_name( 'email' ); ?>"  value="<?php echo esc_attr( $instance[ 'email' ] ); ?>"> 
        </label>
        
    </div>
    <div class="formation_contact_fields_container">
        <label>Fields:</label>
        <div class="tablenav top">
        	<div class="alignleft">
            	<a class="button action add-field" href="#">Add New Field</a>  
            </div>
        </div>
        <table class="wp-list-table widefat fixed tags fields-table">
        	<thead>
            	<tr class="no-fields">
                	<th class="manage-column column-delete" style="width:30px;"></th>
                    <th class="manage-column column-field" >Field</th>         
                </tr>
            </thead>
            <tfoot>
            	<tr class="no-fields">
                	<th class="manage-column column-delete"  style="width:30px;" ></th>                    
                    <th class="manage-column column-field" >Field</th>        
                </tr>
            </tfoot>
            <tbody>
                <tr class="all-fields no-fields">
                    <td colspan="3"><input type="text" name="<?php echo $this->get_field_name( 'fields' ); ?>" class="all-fields widefat" value="<?php echo esc_attr( $instance[ 'fields' ] ); ?>"></td>
                </tr>
                <tr class="template-row no-fields">
                    <td class="row-delete" ><a href="#" class="row-delete"><div class="dashicons dashicons-trash"></div></a></td>
                    <td>
                    	<div class="formation_contact_field_group">
                    		<label>Name:</label>
                    		<input type="text" class="widefat field-name" >
                        </div>
                        <div class="formation_contact_field_group">
                    		<label>Type:</label>
                            <select class="widefat field-type">
                                <option value="text" selected="selected">Text</option>
                                <option value="textarea">Text Box</option>
                                <option value="select">Dropdown</option>
                                <option value="checkbox">Checkbox</option>                    
                            </select>
                        </div>
                        <div class="formation_contact_field_group required">
	                        <input type="checkbox" class="field-required" value="true" >
	                        <label>Required Field</label>
                        </div>                    
                    </td>
                </tr>
                <?php
				
				$fields = json_decode( $instance['fields'] );
				
				if ( empty( $fields ) ) {					
					?>
                    <tr class="fields">
                        <td class="row-delete" ><a href="#" class="row-delete"><div class="dashicons dashicons-trash"></div></a></td>
                        <td>
                        	<div class="formation_contact_field_group">
                    			<label>Name:</label>
                        		<input type="text" class="widefat field-name" >
                            </div>
                            <div class="formation_contact_field_group">
                                <label>Type:</label>
                                <select class="widefat field-type">
                                    <option value="text" selected="selected">Text</option>
                                    <option value="textarea">Text Box</option>
                                    <option value="select">Dropdown</option>
                                    <option value="checkbox">Checkbox</option>                    
                                </select>
                          	</div>
                            <div class="formation_contact_field_group required">
                                    <input type="checkbox" class="field-required" value="true" >
                                    <label>Required Field</label>
                            </div>                    
                        </td>
                    </tr>
                    <?php
				}
				else {
					foreach ( $fields as $field ) {	?>
                        <tr class="fields">
                            <td class="row-delete" ><a href="#" class="row-delete"><div class="dashicons dashicons-trash"></div></a></td>
                            <td>
                            	<div class="formation_contact_field_group">
                                    <label>Name:</label>
                                    <input type="text" class="widefat field-name" value="<?php echo $field[0]; ?>" >
                                </div>
								<div class="formation_contact_field_group">
                    				<label>Type:</label>
                                    <select class="widefat field-type">
                                        <option value="text" <?php if ( $field[1] == 'text' ) { echo 'selected="selected"'; } ?> >Text</option>
                                        <option value="textarea" <?php if ( $field[1] == 'textarea' ) { echo 'selected="selected"'; } ?> >Text Box</option>
                                        <option value="select" <?php if ( $field[1] == 'select' ) { echo 'selected="selected"'; } ?> >Dropdown</option>
                                        <option value="checkbox" <?php if ( $field[1] == 'checkbox' ) { echo 'selected="selected"'; } ?> >Checkbox</option>                    
                                    </select>                                    
									<?php 
                                    if ( $field[1] == 'select' ) { 
                                        foreach ( $field[2] as $option ) {
                                            echo '<div class="formation_contact_option_container removeable" ><a href="#" class="formation_contact_option_remove" ><span class="dashicons dashicons-minus"></span></a><input type="text" class="select-option" value="'.$option.'"></div>';	
                                        }
                                        echo '<a href="#" class="alignright add_option removeable"><div class="dashicons dashicons-plus"></div></a>';
                                    } ?>  
                            	</div>
                                <div class="formation_contact_field_group required">                                    
                                    <input type="checkbox" class="field-required" value="true" <?php echo ( $field[3] == true ? 'checked' : ''); ?> >
                                    <label>Required Field</label>
                                </div>               
                            </td>
                        </tr>
                        <?php
					}
				}
				?>
            </tbody>
        </table>
          
    </div>
</div>