/*!
 * jQuery Canvas Charts Plugin
 * Examples and documentation at: http://antonslair.in/demos/canvas.html
 * Copyright (c) 2012 Anton Punith
 * Version: 0.9 (beta)
 * Dual licensed under the MIT and GPL licenses.
 * http://antonslair.in/license/
 * Requires: jQuery v1.3.2 or later
 */
(function ($)
{
	var methods = {
		barChart: function (options)
		{
			options = $.extend(
			{
				barWidth: 20,
				barGap: 10,
				bottomOffset :25,
				leftOffset :50,
				topOffset:20,
				rightOffset:20,
				steps:10,
				startX:20,
				yLabelx:25
			}, options);
			$(this).each(function ()
			{
				var obj = $(this);
				var count = 0;
				var total = 0;
				var pieInc = 0;
				var hValues = new Array();
				var labels = new Array();
				if(obj.find('caption').html())
				{
					drawCaption(options.canvasId,obj.find('caption').html());
					options.topOffset += 20;
				}
				obj.find('tr').each(function (index)
				{
					hValues[index] = $(this).find('td').html();
					labels[index] = $(this).find('th').html();
					total += parseInt($(this).find('td').html());
				});
				//alert(total);
				var maxVal = Math.max.apply(Math, hValues);
				var rounndMaxVal = Math.round(maxVal);
				var arrayLength = (hValues.length);
				if (!options.height){
					options.height=$('#'+options.canvasId).height();
				}
				options.height = options.height- options.bottomOffset - options.topOffset;
				drawXlabels (options.canvasId,labels,options.startX,options.leftOffset,options.barGap + options.barWidth,options.bottomOffset);
				drawYlabels (options.canvasId,rounndMaxVal, options.bottomOffset,options.topOffset,options.leftOffset,options.rightOffset,options.steps,options.yLabelx);				
				$.each(hValues, function ()
				{
					height = (this / rounndMaxVal) * options.height;
					xCoord = options.leftOffset+(options.barGap + options.barWidth) * count+options.startX;
					drawBar(options.canvasId, xCoord, options.bottomOffset, options.barWidth, height, getColor());
					count++;
				});

			});
		},
		lineChart: function (options)
		{
			options = $.extend(
			{
				spacing:50,
				bottomOffset :25,
				leftOffset :50,
				topOffset:20,
				rightOffset:20,
				steps:10,
				startX:0,
				yLabelx:30				
			}, options);
			$(this).each(function ()
			{
				var obj = $(this);
				var count = 0;
				var hValues = new Array();
				var labels = new Array();
				if(obj.find('caption').html())
				{
					drawCaption(options.canvasId,obj.find('caption').html());
					options.topOffset += 20;
				}				
				obj.find('tbody tr').each(function (index)
				{
					hValues[index] = $(this).find('td').html();
					labels[index] = $(this).find('th').html();
				});
				var maxVal = Math.max.apply(Math, hValues);
				var rounndMaxVal = Math.round(maxVal);
				var arrayLength = (hValues.length);
				if (!options.height){
					options.height=$('#'+options.canvasId).height();
				}
				options.height = options.height- options.bottomOffset - options.topOffset;				
				drawXlabels (options.canvasId,labels,options.startX,options.leftOffset,options.spacing,options.bottomOffset);
				drawYlabels (options.canvasId,rounndMaxVal, options.bottomOffset,options.topOffset,options.leftOffset,options.rightOffset,options.steps,options.yLabelx);								
				$.each(hValues, function ()
				{
					height = (this / rounndMaxVal) * options.height;
					xCoord = options.spacing * count+options.leftOffset+options.startX;
					drawLines(options.canvasId, count, xCoord, options.bottomOffset,height, getColor());
					//drawLines(canvasId, count, xVal,bOffset,h,  color)
				
					count++;
				});
			});
		},		
		pieChart: function (options)
		{
			options = $.extend(
			{
				bottomOffset :20,
				leftOffset :20,
				topOffset:20,
				rightOffset:20			
			}, options);			
			$(this).each(function ()
			{
				var obj = $(this);
				var count = 0;
				var total = 0;
				var pieInc = 0;
				var hValues = new Array();
				var labels = new Array();
				if(obj.find('caption').html())
				{
					drawCaption(options.canvasId,obj.find('caption').html());
					options.topOffset += 20;
				}				
				var canvas = $('#' + options.canvasId)[0];
				var canvas_size = [canvas.width*.7, canvas.height];
				var radius = (Math.min(canvas_size[0]-(options.leftOffset+options.rightOffset), canvas_size[1]-(options.topOffset+options.bottomOffset)) / 2);
				var center = [canvas_size[0]/ 2+options.leftOffset-options.rightOffset , options.topOffset+(canvas_size[1]-(options.topOffset+options.bottomOffset))/2];
				//alert (canvas_size[1]-(options.topOffset+options.bottomOffset))				
				obj.find('tbody tr').each(function (index)
				{
					hValues[index] = $(this).find('td').html();
					labels[index] = $(this).find('th').html();
					total += parseInt($(this).find('td').html());
				});
				//alert(total);
				var maxVal = Math.max.apply(Math, hValues);
				var rounndMaxVal = Math.round(maxVal);
				var arrayLength = (hValues.length);
				//var barW = (options.width-(options.barGap*(arrayLength-1)))/arrayLength;
				$.each(hValues, function ()
				{
					var pivalue = this / total;
					drawPie(options.canvasId, pivalue, pieInc, getColor(),labels,count,center,radius);
					pieInc += pivalue;
					count++;
				});
			});
		}
	};
	$.fn.canvasCharts = function (method)
	{
		// Method calling logic
		if(methods[method])
		{
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method)
		{
			return methods.init.apply(this, arguments);
		}
		else
		{
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	};
	function drawBar(canvasId, x, bOffset, w, h, color)
	{
		//var c=document.getElementById(canvasId);
		var c = $('#' + canvasId)[0];
		var canvasHeight = $('#' + canvasId).height();
		var ctx = c.getContext("2d");
		ctx.fillStyle = color;
		ctx.fillRect(x, canvasHeight - h - bOffset, w, Math.round(h));
	}
	
	function drawLines(canvasId, count, xVal,bOffset,h,  color)
	{
		//drawLines(options.canvasId, count, xCoord,height, getColor());
		var c = $('#' + canvasId)[0];
		var canvasHeight = $('#' + canvasId).height();
		var ctx = c.getContext("2d");
		if(count==0)
		{
			ctx.moveTo(xVal,canvasHeight-h-bOffset);
		}
		else
		{ctx.lineTo(xVal,canvasHeight-h-bOffset);}
		ctx.strokeStyle = "#444"
		ctx.stroke();
		ctx.fillStyle = "#9CBBD1"
		ctx.fillRect(xVal,canvasHeight-h-bOffset,1,h)
		ctx.beginPath();
		//ctx.arc(xVal,canvasHeight-h-bOffset,1, 0, 2 * Math.PI, false);
		ctx.moveTo(xVal,canvasHeight-h-bOffset);
		//ctx.fillStyle = "#444";
		//ctx.fill();
		//ctx.stroke()
	}	

	function drawPie(canvasId, pivalue, pieInc, color,labels,count,center,radius)
	{
		var canvas = $('#' + canvasId)[0];
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(center[0], center[1]);
		var startAngle = Math.PI * (-0.5 + 2 * pieInc); // Starting point on circle
		var endAngle = Math.PI * (-0.5 + 2 * (pieInc + pivalue));
		//alert(pivalue);
		ctx.arc(center[0], center[1], radius, startAngle, endAngle, false);
		ctx.closePath();
		ctx.fillStyle = color; // color
		ctx.fill();
		drawPieLegend(ctx,canvas,labels,count)
	}
	function drawPieLegend(ctx,canvas,labels,count){	  
		 ctx.save();
		 ctx.font = "10px 'arial'";
		 //ctx.fillStyle = "#000";
		 ctx.fillRect((canvas.width*.75) - 20, 40 + 25*count, 10,10);
		 ctx.fillText(labels[count].substring(0, 20), canvas.width*.75, 50 + 25*count);
		 ctx.restore();
	}
	function getColor()
	{
		var rgb = [];
		for(var i = 0; i < 3; i++)
		{
			rgb[i] = Math.round(100 * Math.random() + 50); // [155-255] = lighter colors
		}
		return 'rgb(' + rgb.join(',') + ')';
	}

	function drawCaption (canvasId,caption)
      {
		  var canvas = $('#' + canvasId)[0];
		  var ctx = canvas.getContext('2d');
		  var index=0;		  
		 ctx.save();
		 ctx.font = "bold 16px 'arial'";
		 ctx.fillStyle = "#000";
		 ctx.textAlign = "center";
		 ctx.fillText(caption, canvas.width/2,22);

		 ctx.restore();
      }	
	function drawXlabels (canvasId,labels,lmargin,lOffset,spacing,bOffset)
      {
		  var canvas = $('#' + canvasId)[0];
		  var ctx = canvas.getContext('2d');
		  var index=0;		  
		 ctx.save();
		 
		 		 
		 ctx.font = "10px 'arial'";
		 
		 index=0;
		 $.each(labels, function (){
			 ctx.fillStyle = "#fff";
			 ctx.fillRect(spacing*index+lOffset+lmargin-5,$('#' + canvasId).height()-bOffset+5,spacing,15);
			 ctx.fillStyle = "#000";
			 ctx.fillText(labels[index], spacing*index+lOffset+lmargin,$('#' + canvasId).height()-bOffset+15);
			 index ++;
		 });
		 ctx.restore();
      }
	function drawYlabels (canvasId,maxVal,bOffset,tOffset,x,rOffset,steps,yLabelx)
      {
		  var canvas = $('#' + canvasId)[0];
		  var h = $('#'+canvasId).height()-bOffset;
		  var canvasWidth =$('#'+canvasId).width()-rOffset-x;
		  var ctx = canvas.getContext('2d');
		  var index=0;	
		  var stepValue =0;
		  var gap = (h-tOffset)/steps;
		  var y;
	  	  
		 ctx.save();
		 ctx.fillStyle = "#aaa";
		 ctx.fillRect(x,tOffset,1,h-tOffset);		 
		 ctx.font = "10px 'arial'";
		 for(index=0; index<=steps; index++)
	     { 
			 y = h-(index*gap);
			 ctx.fillStyle = "#000";
			 ctx.textAlign = "center";
		 ctx.fillText(stepValue,yLabelx,y+3);
		 ctx.fillStyle = "#aaa";
		 ctx.fillRect(x,Math.round(y),canvasWidth,1);
		 stepValue = (index<steps-1)?stepValue+Math.round(maxVal/steps):maxVal;
		 }
		 ctx.restore();
      }	  	  
})(jQuery);