Drupal.behaviors.ucOutOfStock =  function() {
  // Your code here
  attrid = 'edit-attributes';

  function checkStock(forms) {
    var form_ids = new Array();
    var node_ids = new Array();
    var attr_ids = new Array();
    $.each(forms, function(index, form) {
      var product = new Object();
      var attributes = new Object();

      var nid = form.attr('id').match(/(?:uc-product-add-to-cart-form-|catalog-buy-it-now-form-)([0-9]+)/)[1];

      attributes.found = new Object();
      attributes.value = new Object();

      $(":input[@name*=attributes]:not(:text)", form).each(function(index){
        id = $(this).attr('name').substring(11,$(this).attr('name').length-1);
        if ($(this).is(':radio')) {
          attributes.found['attr'+id] = 1;
          if ($(this).is(':checked')) {
            if ($(this).val()) {
              attributes.value['attr'+id] = 1;
              attr_ids.push(nid + ':' + id + ':' + $(this).val());
            }
          }
        }
        else {
          attributes.found['attr'+id] = 1;
          if ($(this).val()) {
            attributes.value['attr'+id] = 1;
            attr_ids.push(nid + ':' + id + ':' + $(this).val());
          }
        }
      });

      // find qty
      product['qty'] = 1;
      qty = $(":input[name=qty]", form).val()
      if (qty) {
        product['qty'] = qty;
      }

      // finding if attributes are found with no value
      attributes.found.length = attributes.value.length = 0;
      for (var i in attributes.found) {
        if (i!='length') {
          attributes.found.length++;
        }
      }

      for (var i in attributes.value) {
          if (i!='length') {
          attributes.value.length++;
        }
      }
      if (attributes.found.length != attributes.value.length) {
        // Put back the normal HTML of the add to cart form
        $(".uc_out_of_stock_html", form).html('');
        $("input:submit.node-add-to-cart,input:submit.list-add-to-cart", form).show();
        return;
      }

      if (Drupal.settings.uc_out_of_stock.throbber) {
        $(".uc_out_of_stock_throbbing", form).addClass('uc_oos_throbbing');
      }
      form_ids.push(form.attr('id'));
      node_ids.push(nid);
    });

    if (form_ids.length == 0) {
      return;
    }

    var post = { 'form_ids[]': form_ids, 'node_ids[]': node_ids, 'attr_ids[]': attr_ids }
    $.ajax({
      type: 'post',
      url : Drupal.settings.uc_out_of_stock.path,
      data: post,
      success : function (data, textStatus) {
        $.each(data, function(form_id, stock_level) {
          var form = $('#' + form_id);
          if (stock_level != null && parseInt(stock_level) <= 0) {
            // hide add to cart button
            $("input:submit.node-add-to-cart,input:submit.list-add-to-cart", form).hide();
            // hide qty label, field and wrapper if present and if it follows
            // default theme output
            $("label[for=" + $(":input[name=qty]", form).attr('id') + "]", form).hide();
            $(":input[name=qty]", form).hide();
            $("#" + $(":input[name=qty]", form).attr('id') + "-wrapper", form).hide();
            // Show out of stock message
            $(".uc_out_of_stock_html", form).html(Drupal.settings.uc_out_of_stock.msg);
          }
          else {
            // Put back the normal HTML of the add to cart form
            $(".uc_out_of_stock_html", form).html('');
            // show qty elements
            $("label[for=" + $(":input[name=qty]", form).attr('id') + "]", form).show();
            $(":input[name=qty]", form).show();
            $("#" + $(":input[name=qty]", form).attr('id') + "-wrapper", form).show();
            // show add to cart button
            $("input:submit.node-add-to-cart,input:submit.list-add-to-cart", form).show();
          }

          if (Drupal.settings.uc_out_of_stock.throbber) {
            $(".uc_out_of_stock_throbbing", form).removeClass('uc_oos_throbbing');
          }
        });
      },
      dataType: 'json'
    });
  }

  var forms = new Array();
  $("form[id*=uc-product-add-to-cart-form], form[id*=uc-catalog-buy-it-now-form]").not('.uc-out-stock-processed').each(function() {
    $(this).addClass('uc-out-stock-processed');
    forms.push($(this));
    if (Drupal.settings.uc_out_of_stock.throbber) {
      $("input:submit.node-add-to-cart,input:submit.list-add-to-cart", $(this)).before('<div class="uc_out_of_stock_throbbing">&nbsp;&nbsp;&nbsp;&nbsp;</div>');
    }
    $("input:submit.node-add-to-cart,input:submit.list-add-to-cart", $(this)).after('<div class="uc_out_of_stock_html"></div>');
    var form = $(this);

    $(":input[name*=attributes]:not(:text)", $(this)).change(function(){
      checkStock([form]);
    });
    /* TODO: Feature request - support qty field, would make sense if cart
     * contents are checked in the server as well as just stock
     */
    /*
    $(":input[name=qty]", $(this)).keyup(function(){
      checkStock(eachForm);
    });
    */
  });

  checkStock(forms);
};

