var app=angular.module("myRoute",['ngRoute','ngSanitize'])
  
	app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
		$routeProvider.
		when('/partial1',{
			controller:'loginCtrl',
			templateUrl:"partial/login.html"
		}).
		when('/partial2',{
			controller:'quizCtrl',
			templateUrl:"partial/quiz.html"
		}).
		when('/partial3',{
			controller:'resultCtrl',
			templateUrl:"partial/result.html"
		}).
		otherwise({
			redirectTo:"/partial1"
		});
	
		}])
	
	
app.service('MathService', function($http) {		
    this.add = function(a) {		
	return $http.get(a)
       .then(function(res){       
		return (res.data);
		    })			
		};    
});
 
 app.controller("mainCtrl",['$scope','$location',function($scope,$location){
	 $scope.totalScore=0
	 $scope.earnedScore=0
	 $scope.todos="";
	 $scope.showLogout=false
	 $scope.Uname=""
	 $scope.fillcount=0
	 $scope.logOut=function(){
		 $scope.result=0
		 $location.path("/partial1");
		 $scope.showLogout=false
	 }
	 
}])

app.controller("loginCtrl",['$scope','$http','$location',function($scope,$http,$location,person){
	
	$scope.login = function(username,password) {
		 $http.get('../Angulartest/assets/logindetails.json')
		   .then(function(res){
			  $scope.data = res.data;
			   for(var i=0;i<$scope.data.length;i++){
			   
				   if(username == $scope.data[i].username && password == $scope.data[i].password){
					$scope.$parent.Uname =" "+username	
					$scope.$parent.showLogout = true	   
					 $location.path("/partial2");
					 break;  
				   }
		       }
		   });
		  
		
	}
}])

app.controller("quizCtrl",['$scope','$http','MathService','$location' ,function($scope,$http,MathService,$location){
 $scope.count=0
 $scope.isChoose=false;
 $scope.isfilltheBlank=false;
 $scope.checkboxSelection=0
//alert(MathService.add('todo.json'))
  $http.get('../Angulartest/assets/todo.json')
       .then(function(res){
          $scope.$parent.todos = res.data;
		   $scope.setQues($scope.count) 	 
		   
        });
		
		$scope.setQues=function(no){
		  $scope.question = $scope.$parent.todos[no].question; 
          $scope.answer=  $scope.$parent.todos[no].answer;
		  $scope.type= $scope.$parent.todos[no].type; 
		  $scope.$parent.totalScore = Number($scope.$parent.totalScore) + Number($scope.$parent.todos[no].score);
		  $scope.isChoose=false;
		  $scope.isfilltheBlank=false;		  
		  if($scope.type=="choose"){
			 $scope.isChoose=true;
			 $scope.option = $scope.$parent.todos[no].option;
		  }			  
			if($scope.type=="fill"){
								
				$scope.isfilltheBlank=true;	
				var temp=Number($scope.question.split("_").length)-1	
				for(var i=0;i<temp;i++){					
				 $scope.question=$scope.question.replace("_","<input type='text' id="+i+"></input>")				
				}
				document.getElementById("fill").innerHTML =$scope.question;
			}  
		}
		
		$scope.newValue=function(val){
			$scope.checkboxSelection=val
			$scope.$parent.todos[$scope.count].givenAnswer=$scope.$parent.todos[$scope.count].option[val]
			 $scope.$parent.todos[$scope.count].answerStatus=false
			if($scope.checkboxSelection==$scope.answer){
			 $scope.$parent.todos[$scope.count].answerStatus=true
			 $scope.$parent.earnedScore = Number($scope.$parent.earnedScore) + Number($scope.$parent.todos[$scope.count].score);
			}
			
        }
		
		$scope.continueFunc=function(){
			var no = $scope.todos.length;
			no = no-1
			$scope.$parent.fillcount=$scope.count
			if($scope.$parent.todos[$scope.count].type=="fill"){
				var temp=Number($scope.$parent.todos[$scope.count].question.split("_").length)-1
				 $scope.answer=""	
				for(var i=0;i<temp;i++){					
				 $scope.answer+=document.getElementById(i).value
				 if(i<temp-1){
				 $scope.$parent.todos[$scope.count].givenAnswer+=document.getElementById(i).value+" and "
				 }else{
					  $scope.$parent.todos[$scope.count].givenAnswer+=document.getElementById(i).value
				}
				}
				$scope.$parent.todos[$scope.count].answerStatus=false
				if($scope.answer==$scope.$parent.todos[$scope.count].answer.replace("_","")){
				$scope.$parent.earnedScore = Number($scope.$parent.earnedScore) + Number($scope.$parent.todos[$scope.count].score);
 				$scope.$parent.todos[$scope.count].answerStatus=true
 				$scope.$parent.todos[$scope.count].givenAnswer=$scope.$parent.todos[$scope.count].answer.replace("_"," and ")
				}
			}
				
			if($scope.count<no){								
			 	$scope.count++;
				$scope.setQues($scope.count)				
			}
			else{
				$scope.$parent.showLogout = true
					$location.path("/partial3");

			}
			
		}
		
	$scope.textMsg="Partial two loaded"
}]);

app.controller("resultCtrl",['$scope','$location',function($scope,$location){
	$scope.totalData=$scope.$parent.todos
	$scope.result=0
	$scope.result=Number($scope.$parent.earnedScore)
	$scope.result/=Number($scope.$parent.totalScore)
	//alert($scope.$parent.earnedScore+""+$scope.$parent.totalScore)
	$scope.result*=100
	
	
	 
}])