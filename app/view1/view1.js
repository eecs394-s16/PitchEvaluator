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

    var sessListRef = new Firebase(db_url+"/sessionList");
    var temp = new $firebaseArray(sessListRef);
    temp.$loaded(function() {
      temp.forEach(function(session) {
        if (session.name==$rootScope.session) {
          var teamsRef = new Firebase(session.ref+"/teams");
          var averagesRef = teamsRef.parent().child("averages");
          $scope.averagesArray = $firebaseArray(averagesRef);
          console.log($scope.averagesArray);
          $scope.teamArray = $firebaseArray(new Firebase(session.ref+"/teams"));
          $scope.teamList = $firebaseArray(new Firebase(session.ref+"/teams"));
          $scope.teamList.$loaded(function() {
            $scope.teamList.sort(function(a,b) {return a.rank-b.rank});

            // to create the arrayOfObjects you'll print to CSV
            for (var i = 0; i < $scope.teamList.length; i++) {
              //to make the simple team
              var curTeam = $scope.teamList[i];
              var teamy = new Team(curTeam.name, curTeam.q1Val,
                curTeam.q2Val, curTeam.q3Val, curTeam.q4Val,
                curTeam.ovrAvg, curTeam.rank);
              teamsForCSV.push(teamy);
            }//end for loop

            //data snapshot
            teamsRef.once("value", function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var teamSnap = childSnapshot;
                var reviewsSnap = teamSnap.child("reviews");
                // console.log("team has" + reviewsSnap.numChildren() + "reviews");
                reviewsSnap.forEach(function(childSnapshot) {
                  //save each review as an object, from which you can grab field's
                  var rev = childSnapshot.val();
                  var fullEval = new Eval(rev.teamName, rev.user, rev.q1, rev.cmt1, rev.q2, rev.cmt2, rev.q3, rev.cmt3,
                    rev.q4, rev.cmt4, rev.cmt5);
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
    $scope.saveTeam = function(teamName) {
      teamService.set(teamName);
      $location.path('view2');
    }

    $scope.setSelectedTab = function(tab) {
      $location.path(tab);
    }

    $scope.dragStart = function(e, ui) {
      ui.item.data('start', ui.item.index());
       console.log(ui.item.index());

    }// create a temporary attribute on the element with old index
    $scope.dragEnd = function(e, ui) {
      var start = ui.item.data('start'),
          end = ui.item.index();//get the new and old index

      if (start<end) {
        $scope.teamList[start].rank = end+1;
        for (let i=start+1; i<=end;i++) {
          $scope.teamList[i].rank-=1;
        }
      }
      else {
        $scope.teamList[start].rank = end+1;
        for (let i=end; i<start;i++) {
          $scope.teamList[i].rank+=1;
        }
      }
      for (let i=0; i<$scope.teamList.length;i++) {
        $scope.teamList.$save(i);
      }
      $scope.teamList.sort(function(a,b) {return a.rank-b.rank})
      // for (let i=0; i<$scope.teamList.length;i++) {
      //   console.log($scope.teamList[i].name, $scope.teamList[i].rank);
      // }
    }

    $('#sortable').sortable({
      start: $scope.dragStart,
      update: $scope.dragEnd
    });

    //sam's Download Team Data CSV

  class Team {
    constructor(ToP, PoN, Demo, CI, Business, TA, rank) {
      this.Team_or_Product = ToP;
      this.Problem_or_Need = PoN;
      this.Demo = Demo;
      this.Customer_Insight = CI;
      this.Business = Business;
      this.Team_Average = TA;
      this.Rank = rank;
    }
  }

  class Eval {
    constructor(teamName, Reviewer, PoN, PoNComments, Demo, DemoComments, CI,
      CIComments, Business, BusinessComments, GenComments) {
      this.Team_Name = teamName;
      this.Reviewer = Reviewer;
      this.Problem_or_Need = PoN;
      this.Problem_or_Need_Comments = PoNComments;
      this.Demo = Demo;
      this.Demo_Comments = DemoComments;
      this.Customer_Insight = CI;
      this.Customer_Insight_Comments = CIComments;
      this.Business = Business;
      this.Business_Comments = BusinessComments;
      this.General_Comments = GenComments;
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
    if (csv == null)
        return;

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
    if (csv == null)
      return;
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
    if (csv == null)
      return;
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
