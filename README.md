# PitchEvaluator

###### URL: http://pitchevaluator.herokuapp.com/

###### For a backlog of known issues and bugs, please see the associated Waffle.io for this repository: https://waffle.io/eecs394-s16/PitchEvaluator

## Introduction
PitchEvaluator is an online grading platform initially built to move Northwestern’s NUVention class evaluations from paper to web.
## Contributors
Team Blue from EECS 394:
[Dino Mujkic](http://github.com/dinomujki), [Yoni Pinto](http://github.com/ybpinto), [Sarah Yang](http://github.com/BaiyuY), [Samantha Trippy](http://github.com/samtrippy), [Taylor Xu Zheng](http://github.com/tz0531)
## User Stories
The project is designed to improve the grading and feedback experience for three different kinds of users: professors of the class, judges who review student projects, and students who submit their projects for the class.
####Professor User Stories
* As a professor, I want to see valuable aggregate data from completed reviews
* As a professor, I want to be able to filter reviews/comments by judge
* As a professor, I want to be able to filter reviews/comments by team
* As a professor, I want to show teams their scores

#### Judge User Stories
* As a judge, I want to quickly begin the review process
* As a judge, I want to be able to go back and edit my reviews
* As a judge, I want to evaluate teams against a set of predefined questions
* As a judge, I want to enter comments to aid in teams’ understanding of their grades
* As a judge, I want to stack rank the teams from best to worst


#### Team User Stories
* As a student, I want to see my team's scores and comments
* As a student, I want to compare my team’s scores to other teams’ scores

Installation Instructions:
--------------------

1. Clone the repository to your own computer.
2. Open the terminal and cd into the root of the repository.
3. Run:
  ```
  npm install
  ```
   then run:
  ```
  npm start
  ```
4. Open a browser and go to this url:
```
http://localhost:8000/
```
##Architecture
#### File Architecture
Under the root directory, the folder “app”  is what really matters as shown in Figure 1.
There are 11 folders and 8 other files under  “app”  as shown Figure 2.

Table 1. View  folders

| View Folders   | Description            | Page link   |
|:-------------- |:-----------------------|:------------|
|**addTeam**     | Team creation page     | /addTeam    |
|**login**       | Login page             | /login      |
|**newSession**  | Session creation page  | /newSession |
|**view1**       | Class summary          | /view1      | 
|**view2**       | Review submission page | /view 2     |
|**judge**       | Judge ratings summary  | /judge      |
|**team**        | Team summary page      | /team       |
 
 Table 2. Other folders

| Other Folders          | Description    |
|:-----------------------|:--------------:|
| **services**           | All the service files | 
| **bower_components**   | includes AngularJS dependencies | 

	       

 Table 3. Individual files under “app” folder

| File Name            | Description                                  |          |
| :--------------------|:---------------------------------------------|----------|
| **app.css**          | Main CSS with *navbar*,*index.html* styling  | all      |
| **app.js**           | Claim routing                                | /login   |
| ** favicon.png**     | Favicon image                                | /Tab bar |
| **index.html**       | Main html                                    | all      |
| **indexCtrl.js**     | Controller for *index.html*                  | all      |
| **session_icon.png** | Session icon image                           | Header   |
| **TabsCtrl.js**      | Controller for *navbar*                      | all      |
| **user_icon.png**    | User  icon image                             | Header   |

####View File Structure
As shown in Figure 3, please include the html, js, css file and image resources in the individual view File

  
