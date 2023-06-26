-- Function to check Login credentials
create or replace function login(user_id_in text, pass text) 
returns int 
as $$ 
declare 
r record ;
begin 
for r in select * from users loop
	if r.username = user_id_in then 
		if r.password = MD5(pass) then
			return r.user_id;
		else 
			return 0;
		end if ;
	end if ;
end loop ;
return 0;
end ;
$$ language plpgsql ;

-- Function called whenever upvote or downvote is done on a post
-- upvote = votess = +1 vote
-- downvote = votess = -1 vote
create or replace function votes_track_post(user_idi int, post_idi TEXT, votess int)
returns int
as $$
declare 
r record ; 
begin 
for r in select * from post_votes loop
if r.user_id = user_idi and r.post_id = post_idi then 
	exit ;
end if ;
end loop ;

if r.flag = votess and r.user_id = user_idi and r.post_id = post_idi then 
	delete from post_votes where r.user_id = user_id and r.post_id = post_id ;
elsif r.flag <> votess and r.user_id = user_idi and r.post_id = post_idi then 
	update post_votes set flag = votess where user_id = r.user_id and post_id = r.post_id ;
else 
	insert into post_votes values(post_idi,user_idi,vote) ;
end if ;

return 1;
end ;
$$ language plpgsql ;

-- Function called whenever upvote or downvote is done on a comment
-- upvote = votess = +1 vote
-- downvote = votess = -1 vote
create or replace function votes_track_comment(user_idi int, comment_idi TEXT, votess int)
returns int
as $$
declare 
r record ; 
begin 
for r in select * from comment_votes loop
if r.user_id = user_idi and r.comment_id = comment_idi then 
	exit ;
end if ;
end loop ;
if r.flag = votess and r.user_id = user_id and r.comment_id = comment_id then 
	delete from comment_votes where r.user_id = user_id and r.comment_id = comment_id ;
elsif r.flag <> votess and r.user_id = user_id and r.comment_id = comment_id then 
	update comment_votes set vote = votess where r.user_id = user_id and r.comment_id = comment_id ;
else 
	insert into comment_votes values(comment_idi,user_idi,vote) ;
end if ;
return 1;
end ;
$$ language plpgsql ;

-- Function called when users password need to be changed
create or replace function update_password(user_id_in int , pass text)
returns int 
as $$ 
declare 
begin 
update users set password = MD5(pass) where user_id = user_id_in;
return 1 ;
end ;
$$ language plpgsql ;


-- Function used to set number of upvotes and downvotes as the post is liked/ disliked 
create or replace function update_upvotes_downvotes_post(post_id_in text, up int, down int)
returns int 
as $$
declare 
r record ;
begin 
update posts set upvotes = upvotes+up , downvotes = downvotes-down where post_id = post_id_in ;
for r in select * from posts loop
if r.post_id = post_id_in then 
	EXIT ;
end if ;
end loop; 
update users set upvotes = upvotes+up , downvotes = downvotes-down where r.user_id = users.user_id ;
return 1 ;
end ;
$$ language plpgsql ;

-- Function used to set number of upvotes and downvotes as the comment is liked / disliked 
create or replace function update_upvotes_downvotes_comment(comment_id_in text, up int, down int)
returns int 
as $$
declare 
r record ;
begin 
update comments set upvotes = upvotes+up , downvotes = downvotes-down where comment_id = comment_id_in ;
for r in select * from comments loop
if r.comment_id = comment_id_in then 
	EXIT ;
end if ;
end loop;
update users set upvotes = upvotes+up , downvotes = downvotes-down where r.user_id = users.user_id ;
return 1 ;
end ;
$$ language plpgsql ;

------------------------------------------------------- SEARCHING FOR USERS ---------------------------------
create or replace function search_posts_by_user_id(user_id_in int)
returns table(
	post_id_out TEXT ,
	user_id_out int ,
	title_out TEXT ,
	body_out TEXT ,
	image_out BYTEA ,
	time_created_out_time timestamp,
	edit_status_out int,
	upvotes_out int ,
	downvotes_out int ,
	tags_out TEXT[] ,
	availability_of_post_to_ans_out int
)
as $$
declare 
r record ;
begin 
for r in select * from posts loop
if user_id_in = r.user_id then 
	post_id_out := r.post_id ;
	user_id_out := r.user_id ;
	title_out := r.title ;
	body_out := r.body ;
	image_out := r.image ;
	time_created_out_time := r.time_created ;
	edit_status_out := r.edit_status ;
	upvotes_out := r.upvotes ;
	downvotes_out := r.downvotes ;
	tags_out := r.tags ;
	availability_of_post_to_ans_out := r.availability_of_post_to_ans ;
	return next ;
end if ;
end loop ;
end ;
$$ language plpgsql ;

-- Searching based on user_id of the user
-- Time of posting Recent to Old
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans  ,extract(epoch from current_timestamp - time_created_out::timestamp) as duration  FROM search_posts_by_user_id(4) order by duration Asc ; 
-- Time of posting Old to Recent
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans ,extract(epoch from current_timestamp - time_created_out::timestamp) as durationFROM search_posts_by_user_id(4) order by time_created_out_time desc ; 
-- Upvotes low to high sort 
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_user_id(4) order by upvotes asc ; 
-- Upvotes high to low sort 
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_user_id(4) order by upvotes desc ; 

------------------------------------------------------- SEARCHING BASED ON TAGS ---------------------------------

create or replace function search_posts_by_tags(tags_in text[])
returns table(
	post_id_out TEXT ,
	user_id_out int ,
	title_out TEXT ,
	body_out TEXT ,
	image_out BYTEA ,
	time_created_out_time timestamp,
	edit_status_out int,
	upvotes_out int ,
	downvotes_out int ,
	tags_out TEXT[] ,
	availability_of_post_to_ans_out int
)
as $$
declare 
r record ;
tags_temp text[] ;
i text ;
j text;
counter int := 0;
begin 
for r in select * from posts loop
counter := 0;
tags_temp := r.tags;
if tags_in is not null then 
foreach i in array tags_in loop 
if tags_temp is not null then 
foreach j in array tags_temp loop 
if j = i then 
counter := counter + 1 ;
end if ;
end loop;
end if ;
end loop;
if cardinality(r.tags) >= counter and counter > 0 and counter >= cardinality(tags_in) then 
	post_id_out := r.post_id ;
	user_id_out := r.user_id ;
	title_out := r.title ;
	body_out := r.body ;
	image_out := r.image ;
	time_created_out_time := r.time_created ;
	edit_status_out := r.edit_status ;
	upvotes_out := r.upvotes ;
	downvotes_out := r.downvotes ;
	tags_out := r.tags ;
	availability_of_post_to_ans_out := r.availability_of_post_to_ans ;
return next ;
end if ;
end if ;
end loop ;
end ;
$$ language plpgsql ;

-- Searching based on tags of posts
-- Time of posting Recent to Old
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_tags('{C,C++,Python}') order by time_created_out_time desc ; 
-- Time of posting Old to Recent
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_tags('{C,C++,Python}') order by time_created_out_time asc ; 
-- Upvotes low to high sort 
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_tags('{C,C++,Python}') order by upvotes asc ;
-- Upvotes high to low sort 
select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_tags('{C,C++,Python}') order by upvotes desc ;
