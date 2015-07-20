var amortizationCalc = angular.module('amortizationCalc', ['nvd3ChartDirectives']);

amortizationCalc.controller('CalculatorController', function($scope) {
	$scope.payments = [];
	$scope.updateVals = function() {
		var principal = parseInt($scope.principal);
		var rate = parseFloat($scope.rate) / 1200;
		var periods = parseInt($scope.years) * 12;
		if(!isNaN(principal) && !isNaN(rate) && !isNaN(periods)) {
			var p = (rate*principal)/(1 - Math.pow(1 + rate, -1*periods));
			var d = new Date();
			var month = d.getMonth();
			var year = d.getYear();
			$scope.payment = p;
			$scope.payments = [
				{
					month: month,
					year: year,
					interest: principal*rate,
					principal: p - (principal*rate),
					balance: principal - (p - (principal*rate)),
					totPrincipal: p - (principal*rate),
					totInterest: principal*rate,
					totPaid: p
				}
			];
			var curBalance = $scope.payments[0].balance;
			var totInterest = $scope.payments[0].totInterest;
			for(var i = 1; i < periods; i++)
			{
				if(month == 11){
					month = 0;
					year++;
				} else {
					month++;
				}
				var last = $scope.payments[i-1];
				$scope.payments.push({ 
					month: month,
					year: year,
					interest: curBalance*rate,
					principal: p - (curBalance*rate),
					balance: curBalance - (p - (curBalance*rate)),
					totPrincipal: principal - (curBalance - (p - (curBalance*rate))),
					totInterest: totInterest + curBalance*rate,
					totPaid: (i+1)*p
				});
				curBalance = $scope.payments[i].balance;
				totInterest = $scope.payments[i].totInterest;
			}

			/*nv.addGraph(function(){
				var chart = nv.models.pieChart()
					.x(function(d){ return d.label })
					.y(function(d){ return d.value })
					.color(["#5cb85c","#d9534f"])
					.margin({"top": 0, "left": 0, "right": 0, "bottom": 0})
					.showLegend(false)
				;
				var data = [
							{ "label": "Principal", "value": $scope.payments[$scope.payments.length - 1].totPrincipal },
							{ "label": "Interest", "value": $scope.payments[$scope.payments.length - 1].totInterest }
						];
				d3.select("#loan-breakdown svg")
					.datum(data)
					.call(chart);

				return chart;
			});*/

			$scope.xoxo = function(){
				return function(d) { return d.key };
			};

			$scope.yoyo = function(){
				return function(d) { return d.y };
			};

			$scope.xoxoxo = function(){
				return function(d, i) { return i; };
			};

			$scope.yoyoyo = function(){
				return function(d) { return d[0]; };
			};

			$scope.colorsFn = function(){
				return function(d,i){ return ( ["#5cb85c","#d9534f"] )[i]; };
			};

			$scope.pieChartData = [
							{ "key": "Principal", "y": $scope.payments[$scope.payments.length - 1].totPrincipal },
							{ "key": "Interest", "y": $scope.payments[$scope.payments.length - 1].totInterest }
						];
			$scope.linePlusBarChartData = [
							{ 	
								"key": "Principal", "bar": true, "color": "#5cb85c", 
								"values": $scope.payments.map(function(pmnt){ return [pmnt.principal]; })
							},
							{ 	
								"key": "Interest", "color": "#d9534f", 
								"values": $scope.payments.map(function(pmnt){ return [pmnt.interest]; })
							}
						];
			/*nv.addGraph(function(){
				var chart = nv.models.linePlusBarChart()
					.x(function(d,i){ return i })
					.y(function(d,i){ return d[0] })
					.margin({"top": 0, "left": 0, "right": 0, "bottom": 0})
					.showLegend(false)
					.focusEnable(false)
				;
				var data = [
							{ 	
								"key": "Principal", "bar": true, "color": "#5cb85c", 
								"values": $scope.payments.map(function(pmnt){ return [pmnt.principal]; })
							},
							{ 	
								"key": "Interest", "color": "#d9534f", 
								"values": $scope.payments.map(function(pmnt){ return [pmnt.interest]; })
							}
						];
				d3.select("#payment-graph svg")
					.datum(data)
					.call(chart);

				return chart;
			});*/
		}
	};
	$scope.updateVals();
});

amortizationCalc.directive('myDirective', function() {
	return function(scope, elem, attrs) {
		var data = [
			{
				key: "Principal",
				values: [
					{
						key: "Principal",
						series: 0,
						x: 0,
						y: scope.pmnt.principal
					}
				]
			},
			{
				key: "Interest",
				values: [
					{
						key: "Interest",
						series: 1,
						x: 0,
						y: scope.pmnt.interest
					}
				]
			},
		];

		nv.addGraph(function() {
		    var chart = nv.models.multiBarHorizontalChart()
		      .showControls(false)
		      .showLegend(false)
		      .showXAxis(false)
		      .showYAxis(false)
		      .stacked(true)
		      .groupSpacing(0.1)
		      .duration(0)
		      .margin({"top": 0, "left": 0, "right": 0, "bottom": 0})
		      .color(["#5cb85c","#d9534f"]);
		    ;

		    chart.tooltip
		    	.headerEnabled(false)
		    	.duration(0)
		    	.hideDelay(0)
		    	.contentGenerator(function(d){
		    		if(d === null)
		    		{
		    			return "";
		    		}
		    		return '<span>$'+d3.format(",.2f")(d.series[0].value)+'</span>';
		    	})
		    ;


		    d3.select($(elem).find("svg")[0])
		        .datum(data)
		        .call(chart);

		    //nv.utils.windowResize(chart.update);

		    return chart;
		});
	};
});
