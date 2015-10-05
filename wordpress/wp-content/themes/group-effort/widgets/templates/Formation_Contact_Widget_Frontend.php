<?php

$fields = json_decode( $instance['fields'] );

echo $args['before_widget'];
echo '<h3 class="widget-title">'.$instance['title'].'</h3>';
?>

<form role="form" method="post" action="index.php">

<?php
if ( $this->error ) {
	?>
    <div class="alert alert-warning alert-dismissible" role="alert">
    	<button type="button" class="close" data-dismiss="alert">
    		<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
        </button>
    	<?php echo $this->error_message; ?>
	</div>
    <?php	
}
?>



<?php				
if ( !empty( $fields ) ) {
	foreach ( $fields as $key => $field ) {
		$checkbox = ( $field[1] == 'checkbox' ) ? true : false;
		$input_class = 'form-control';
		$field_html = $this->get_field_html( $key, $field );		
		
		if ( $checkbox == false ) {
			?>
			<div class="form-group <?php echo ( in_array( $key, $this->empty_fields ) ? 'has-error' : '' ); ?>">
				<label for="field-'.$key.'"><?php echo ( $field[3] == 'true' ? '<span class="required_field">*</span>' : '' ); ?> <?php echo $field[0]; ?></label>
                <?php echo $field_html; ?>
                <?php echo ( in_array( $key, $this->empty_fields ) ? '<span class="help-block has-error">This field can not be empty.</span>' : '' ); ?>
			</div>
			<?php
		}
		else {
			?>
         	<div class="checkbox">
                <label>
                	<?php echo $field_html; ?>
                </label>
            </div>                           
            <?php			
		}
	}
}

?>
<input type="text" name="body" value="" class="hp" />
<button type="submit" class="btn btn-default">Submit</button>
<input type="hidden" name="action" value="formation_contact_submit" >
<div class="required_fields">* Indicates required fields</div>
</form>

<?php

echo $args['after_widget'];

?>