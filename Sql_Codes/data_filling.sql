copy users(username,gmail) from
'path_to_project\Sql_Codes\data_csv\Users.csv'
DELIMITER ','
CSV HEADER ;

copy tags(tag_name) from 
'path_to_project\Sql_Codes\data_csv\Tags.csv'
DELIMITER ','
CSV HEADER ;

copy posts(user_id,title,body,tags) from 
'path_to_project\Sql_Codes\data_csv\Posts.csv'
DELIMITER ','
CSV HEADER ;

copy comments(post_id,user_id,body) from 
'path_to_project\Sql_Codes\data_csv\Comments.csv'
DELIMITER ','
CSV HEADER ;


