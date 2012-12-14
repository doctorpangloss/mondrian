/**
 * @author Benjamin S. Berman
 * © 2012 All Rights Reserved
 * */

String.prototype.startsWith = function(str)
{return (this.match("^"+str)==str)};

Number.prototype.toComma = function() {
	var x = this.toString().split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

// The Mondrian
var Mondrian = {};

// A list of units for costs. Alternatives to dollars.
Mondrian.unitList = ['Pokemon cards','dogs','bushels of wheat','Rembrandts','Canadian dollars','sausages','cigarettes','cigarillos','DVDs','18" rims','crosses','coffins','gym memberships',"children's kidneys","vampire hearts","Google+ likes","handguns","Netflix subscriptions","toasted sandwiches","Starbucks gift cards","candy wrappers","Instagram filters","Jews","cow parts","used Costco receipts","kitchen appliances","ketchup packets"];

// Random number utility functions
Mondrian.getRandomInteger = function(n,r) {
      return n+Math.floor(Math.random()*(r-n));
};

Mondrian.getRandomArray = function(lower,upper,size) {
	  var p = [];
	  for (var i = 0; i < size; i++) {
		  p.push(Mondrian.getRandomInteger(lower,upper));
	  }
	  return p;
};

// Generate a random title procedurally.
Mondrian.getRandomTitle = function() {
	if (Math.random() < .75) {
		return Mondrian.nounDict[Mondrian.getRandomInteger(0,Mondrian.nounDict.length-1)] + ' ' + Mondrian.prepDict[Mondrian.getRandomInteger(0,Mondrian.prepDict.length-1)] +
			   ' ' + Mondrian.nounDict[Mondrian.getRandomInteger(0,Mondrian.nounDict.length-1)];
	} else {
		return 'No. ' + Mondrian.getRandomInteger(2,200).toString();
	}
}

// Generate a random price.
Mondrian.getRandomPrice = function() {
	return Mondrian.getRandomInteger(2,100).toString() + ' ' + Mondrian.unitList[Mondrian.getRandomInteger(0,Mondrian.unitList.length-1)];
}


// Cart management
Mondrian.items = [];
Mondrian.pages = [];
Mondrian.cart = [];

Mondrian.addToCart = function(index) {
	// Get reference to button
	var o = $('#button-' + index).html('Added to Cart').click(function () {
		$(this).html('Already added!'); });
	this.cart.push(index);
	$('#thumbnail-' + index.toString()).clone().prependTo('#cart');
	var sum = 0;
	for (var i = 0; i< this.cart.length; i++) {
		sum+=this.items[this.cart[i]].priceInt;
	}
	$('#total').html('Total: $' + sum + '.00');
}

Mondrian.colors = [{fill:'red'},{fill:'yellow'},{fill:'blue'},{fill:'black'}];
Mondrian.getRandomFill = function(n) {
	return this.colors[n];
}

// Creates a new Mondrian artwork and returns the Raphael paper on which it is drawn.
Mondrian.newMondrian = function(width,height,lineWidth) {
    // Number of horizontal cells
	var xi = this.getRandomInteger(3,7)+2;
    // Number of vertical cells
	var yj = this.getRandomInteger(3,7)+2;
    // X-coordinate of upper left corners of white boxes
	var xs = [0].concat(Mondrian.getRandomArray(0,width / lineWidth, xi-2)).concat([width / lineWidth+lineWidth]).sort(function(a,b) {return (a - b);});
	// Y-coordinate of upper left corner of white boxes
    var ys = [0].concat(Mondrian.getRandomArray(0,height / lineWidth, yj-2)).concat([height / lineWidth+lineWidth]).sort(function(a,b) {return (a - b);});
	
	var l = (xi-1)*(yj-1);

    // Number of colored boxes
	var ll = this.getRandomInteger(3,9);
    // A random list of box indices, used to decide which boxes to color
	var lr = this.getRandomArray(0,l,ll);
    // A random list of colors to assign to each box
	var lcr = this.getRandomArray(0,Mondrian.colors.length,ll);
	
	return {xs:xs,ys:ys,
			xi:xi,yj:yj,l:l,ll:ll,lr:lr,lcr:lcr,
			paper:null,boxes:[],
			render:function (container,width,height,lineWidth) {
				this.paper = Raphael(container,width,height);
				this.boxes = [];
                // Draw in the "lines" by making everything black
				this.paper.rect(0,0,width,height).attr({fill:'black'});
				// Draw white boxes over the black background
				for (var i = 0; i < this.xi-1; i++) {
					for (var j = 0; j< this.yj-1; j++) {
                        // For each cell
						this.boxes.push(
                            // Draw a white box from xs[i],js[j] to xs[i+] to ys[j+1]
							this.paper.rect(
								this.xs[i]*lineWidth,this.ys[j]*lineWidth,
								this.xs[i+1]*lineWidth-this.xs[i]*lineWidth-lineWidth,
								this.ys[j+1]*lineWidth-this.ys[j]*lineWidth-lineWidth)
							.attr({fill:'white'}));
					}
				}
				
				// Make a random assortment of boxes red, yellow and blue.
				for (var li = 0; li < this.ll; li++) {
					this.boxes[this.lr[li]].attr(Mondrian.getRandomFill(this.lcr[li]));
				}
				return this.paper;
			}
	}
}

Mondrian.generateItems = function(length) {
	var itemsGend = [];
	for (var i = 0; i<length; i++) {
		var o = {};
		o.title = this.getRandomTitle();
		o.year = this.getRandomInteger(1872,1944).toString();
		var c = Math.random();
		if (c < .25) {
			o.priceInt = this.getRandomInteger(1,20);
			o.price = '$' + o.priceInt.toComma() + '.00';
		} else if (c < .5) {
			o.priceInt = this.getRandomInteger(20,200)*500;
			o.price = '$' + o.priceInt.toComma() + '.00';
		} else {
			o.priceInt = 0;
			o.price = this.getRandomPrice();
		}
		o.id = Mondrian.items.length;
		o.mondrian = Mondrian.newMondrian(210,210,3);
	
		o.html = "<div id='thumbnail-" +o.id + "' class='thumbnail'><div id='mondrian-thumb-" +o.id+ "' class='mondrian-thumb'></div><div class='text'><div class='text-container'>" +
						"<h3>" + o.title + "</h3>" +
						"<p>Oil on canvas, " + o.year + "<br />" +
						o.price + "</p>" +
						"<button style='width:100%;' id='button-" +o.id+ "' onclick='m.addToCart(" +o.id+ ")'>Add to Cart</button></div></div></div>";
		itemsGend.push(o);
		this.items.push(o);
	}
	return itemsGend;
}


Mondrian.generatePage = function(length) {
	var p = {};
	
	p.id = this.pages.length;
	p.prevLink = '#items-' + (p.id-1 < 0 ? '0' : Number(p.id - 1).toString());
	p.nextLink = '#items-' + Number(p.id+1).toString();
	var m = "<div class='centered'><ul class='menu'><li><a href='" + p.prevLink + "'>Previous Page</a></li><li>Page " +Number(p.id+1).toString()+ "</li><li><a href='" + p.nextLink + "'>Next Page</a></li></ul></div>";
	p.items = this.generateItems(12);
	p.html = '<div id="items-' + p.id + '" class="page webkit-background"><h2 style="text-align:center;">New Items</h2>'+m+'<div id="thumbnails">';
	for (var i = 0; i<length; i++) {
		p.html+=p.items[i].html;
	}
	p.html+='</div><div class="clearfloat"></div></div>';
	this.pages.push(p);
	return p;
}

Mondrian.pushNewPageToDOM = function(length) {
	var p = Mondrian.generatePage(length);
	$('#pages').append(p.html);
	for (var i = 0; i < p.items.length; i++) {
		var v = p.items[i];
		v.mondrian.render(document.getElementById('mondrian-thumb-' + v.id.toString()),192,192,3);
	}
	return '#items-' + p.id;
}

Mondrian.pageNames = ['cart','checkout','thank-you'];

Mondrian.goto = function(page) {
	Mondrian.target = $(page);
	if (!(Mondrian.target.attr('id')==Mondrian.current.attr('id'))) {
		Mondrian.target.addClass('webkit-foreground');
		Mondrian.current.removeClass('webkit-foreground');
		Mondrian.current = Mondrian.target;
		_gaq.push(['_trackPageview', page]);
	}
}

Mondrian.navigate = function(event) {
	var requestedItemsPage = event.value.match(/items-(\d+)/);
	var requestedDetailPage = event.value.match(/detail-(\d+)/);
	if (requestedItemsPage) {
		var requestedID = requestedItemsPage[1];
		if (requestedID == Mondrian.pages.length) {
			// Generate a new page, next page reqeusted
			Mondrian.goto(Mondrian.pushNewPageToDOM(12));
		} else if (requestedID > Mondrian.pages.length) {
			// Too far into the future, do not generate page
			Mondrian.goto('#items-0');
		} else {
			Mondrian.goto('#items-' + requestedID.toString());
		}
	} else if (requestedDetailPage) {
		var requestedDetail = requestedDetailPage[1];
		if (requestedDetail < Mondrian.items.length) {
			// Construct detail page
		} else {
			// Not found
		}
	} else {
		if ($.inArray(event.value,Mondrian.pageNames)) {
			Mondrian.goto('#'+event.value);
		} else {
			Mondrian.goto('#items-0');
		}
	}
	
}

$(document).ready(function() {
	// Setup navigation
	$.address.change(Mondrian.navigate);
	
	// Build a default store page
	Mondrian.pushNewPageToDOM(12);
	
	// Set current page
	$('.page').addClass('webkit-background');
	Mondrian.current = $('#items-0');
	Mondrian.current.addClass('webkit-foreground');
});