'use strict';
angular
  .module('PitchEvaluator')
  .controller('View1Ctrl', function($rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, loggedinCheck, teamService, userService, db_url) {

    loggedinCheck.check();
    if (!permissionsService.isPermitted('Overview')) {
      // if ($rootScope.role == 'Judge') {
      //   $location.path('judge');
      // }
      if ($rootScope.role == 'Team'){
          $location.path('team');
      }
    }

    var teamsForCSV = [];
    var fullCSV = [];
    var tempTeam = [];
    var teamArray = [];

    var ref = $rootScope.masterref;
    var sessListRef = firebase.database().ref().child("sessionList");
    //var sessListRef = new Firebase(db_url+"/sessionList");
    var temp = new $firebaseArray(sessListRef);
    temp.$loaded(function() {
      temp.forEach(function(session) {
        if (session.name==$rootScope.session) {
          var teamsRef=firebase.database().ref(session.ref).child('teams')
//          var teamsRef = new Firebase(session.ref+"/teams");
          var averagesRef = teamsRef.parent.child("averages");
          $scope.averagesArray = $firebaseArray(averagesRef);
          
          $scope.teamArray = $firebaseArray(firebase.database().ref(session.ref).child("teams"));
//          $scope.teamArray = $firebaseArray(new Firebase(session.ref+"/teams"));
          $scope.teamList = $firebaseArray(firebase.database().ref(session.ref).child("teams"));
      //    $scope.teamList = $firebaseArray(new Firebase(session.ref+"/teams"));
          $scope.teamList.$loaded(function() {
            $scope.teamList.sort(function(a,b) {return a.rank-b.rank});

            // to create the arrayOfObjects you'll print to CSV
            for (var i = 0; i < $scope.teamList.length; i++) {
              //to make the simple team
              var curTeam = $scope.teamList[i];
              var teamy = new Team(curTeam.name, curTeam.q1Val,
                curTeam.q2Val, curTeam.q3Val, curTeam.q4Val,
                curTeam.q5Val, 
                curTeam.ovrAvg);
              teamsForCSV.push(teamy);
            }//end for loop

            //data snapshot
            teamsRef.once("value", function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var teamSnap = childSnapshot;
                var reviewsSnap = teamSnap.child("reviews");
                reviewsSnap.forEach(function(childSnapshot) {
                  //save each review as an object, from which you can grab field's
                  var rev = childSnapshot.val();
                  var fullEval = new Eval(rev.teamName, rev.user, rev.rank, rev.q1, rev.cmt1, 
                    rev.q2, rev.cmt2, rev.q3, rev.cmt3, rev.q4, rev.cmt4, 
                    rev.q5, rev.cmt5, rev.q6, 
                    rev.q8, rev.cmt8);
                  fullCSV.push(fullEval);
                  tempTeam.push(fullEval);
                }); //end review loop
                teamArray.push(tempTeam);
                tempTeam = [];
              }); //end team loop
            });

          }) //end teamList.$loaded
        } //end if
      }); //end temp.forEach
    }); //end temp.$loaded

    //Function to store the team in the teamService
    $scope.saveTeam = function(teamID, teamName) {
      $rootScope.teamID = teamID;
      $rootScope.teamName = teamName;
      $location.path('team');
    }

    $scope.setSelectedTab = function(tab) {
      $location.path(tab);
    }

    $scope.dragStart = function(e, ui) {
      ui.item.data('start', ui.item.index());
      console.log(ui.item.index());

    }// create a temporary attribute on the element with old index
    
    $scope.dragEnd = function(e, ui) {
      console.log('dragend');

      var start = ui.item.data('start'),
          end = ui.item.index();//get the new and old index

      if (start<end) {
        $scope.teamList[start].rank = end+1;
        for (var i=start+1; i<=end;i++) {
          $scope.teamList[i].rank-=1;
        }
      }
      else {
        $scope.teamList[start].rank = end+1;
        for (var i=end; i<start;i++) {
          $scope.teamList[i].rank+=1;
        }
      }

      var teamsRef = new Firebase(ref.child("teams"));

      for (var i=0; i<$scope.teamList.length;i++) {
        $scope.teamList.$save(i);
      }

      $scope.teamList.sort(function(a,b) {return a.rank-b.rank})
    }

    $('#sortable').sortable({
      start: $scope.dragStart,
      update: $scope.dragEnd
    });

    var calcAvgRank = function(team) {
      var rank;
      var ranksum = 0;

      var reviewArray = $firebaseArray(team.child("reviews"));

      reviewArray.$loaded().then(function() {
        for (var i = 0; i < teamsArray.length; i++) {
          ranksum += parseFloat(teamsArray[i]);
        }

        rank = ranksum/reviewArray.length;
        rank = rank.toFixed(2);

        team.update({
          rank: rank
        })

      });

    }

//Team Class for Summary CSV w/o comments
  class Team {
    constructor(name, q1, q2, q3, q4, 
      q5, TA) {
      this.Team_Name = name;
      this.Value_Prop = q1;
      this.Q_and_A = q2;
      this.Product_Market_Fit = q3;
      this.Understands_Customers = q4;
      this.Customer_Acquisition = q5;
      this.Team_Average = TA;

    }
  }

//Eval Class for Summary CSV w/ Comments & Individual Team CSVs
  class Eval {
    constructor(teamName, Reviewer, Rank, 
      q1, q1c, q2, q2c, q3, q3c, q4, q4c, 
      q5, q5c, q6, q6c, q7, q7c, q8, q8c) {
      this.Team_Name = teamName;
      this.Reviewer = Reviewer;
      this.Rank = Rank;
      this.Value_Prop = q1;
      this.Value_Prop_Comments = q1c;
      this.Q_and_A = q2;
      this.Q_and_A_Comments = q2c;
      this.Product_Market_Fit = q3;
      this.Product_Market_Fit_Comments = q3c;
      this.Understands_Customers = q4;
      this.Understands_Customers_Comments = q4c;
      this.Customer_Acquisition = q5;
      this.Customer_Acquisition_Comments = q5c;
      this.Continue = q8;
      this.Continue_Comments = q8c;
    }
  }

  function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
  }

  $scope.downloadCSV = function(args) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: teamsForCSV
    });
    if (csv == null){
        window.alert("No Evaulation Report Available");
        return;
    }

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  $scope.downloadFullCSV = function(args) {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
      data: fullCSV
    });
    if (csv == null){
        window.alert("No Evaulation Report Available");
        return;
    }
    filename = args.filename || 'export.csv';
     if (!csv.match(/^data:text\/csv/i)) {
          csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  $scope.downloadTeamCSV = function(args) {
    var data, filename, link, index;
    index = args.index;
    console.log(index);
    var csv = convertArrayOfObjectsToCSV({
      data: teamArray[index]
    });
    if (csv == null){
      window.alert("No Evaulation Report Available");
      return;
    }
    filename = args.filename || 'export.csv';
     if (!csv.match(/^data:text\/csv/i)) {
          csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

});
