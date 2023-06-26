----------------------------------------------------------- Insertions to Users Table ----------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_users_table_1()
returns trigger 
as $$ 
declare 
begin 
new.password = MD5(new.username);
return new ;
end ;
$$ language plpgsql ;

-- Trigger to handle insertions to users table 
create or replace trigger insert_users_1 
before insert 
on users 
for each row 
execute procedure insert_users_table_1() ;

CREATE OR REPLACE FUNCTION insert_users_table_2()
returns trigger 
as $$ 
declare 
begin 
insert into user_count_number(user_id) values(new.user_id);
return new ;
end ;
$$ language plpgsql ;

-- Trigger to add new tuple to user_count_number table after insertion of new tuple to users table
create or replace trigger insert_users_2
after insert 
on users 
for each row 
execute procedure insert_users_table_2() ;

----------------------------------------------------------- Insertions to Posts Table ----------------------------------------------------------------------------------
create or replace function insert_posts_table()
returns trigger 
as $$
declare 
r record ;
q record ;
t record ;
i TEXT ;
loopvar int := 0; 
checke int := 0;
count int ;
begin 
for r in select * from users 
loop
if r.user_id = new.user_id then 
	EXIT ;
end if ;
end loop;

for q in select * from user_count_number 
loop 
if q.user_id = new.user_id then 
	count := q.total_number_posts ; 
	count := count + 1 ;
	update user_count_number set total_number_posts = count where user_id = q.user_id ;
end if ;
end loop;

loopvar := 0 ;
if new.tags is not null then 
foreach i in array new.tags loop 
loopvar := loopvar + 1 ;
checke := 0 ;
for t in select * from tags loop
if i = t.tag_name then 
	checke := checke + 1 ;
	EXIT ;
end if ;
end loop;
if checke = 1 then 
CONTINUE ;
else 
	new.tags[loopvar] := null ;
end if ;
end loop;
end if ;
new.post_id = r.username || count ;
return new ;
end ;
$$ language plpgsql ;

-- Trigger to handle insertion to posts table
create or replace trigger insert_posts 
before insert 
on posts 
for each row 
execute procedure insert_posts_table() ;

----------------------------------------------------------- Insertions to Comments Table ----------------------------------------------------------------------------------
create or replace function insert_comments_table()
returns trigger 
as $$
declare
r record ;
q record ;
count int ;
begin 
for r in select * from users 
loop
if r.user_id = new.user_id then 
	EXIT ;
end if ;
end loop;

for q in select * from user_count_number 
loop 
if q.user_id = new.user_id then 
	count := q.total_number_comments ; 
	count := count + 1 ;
	update user_count_number set total_number_comments = count where user_id = q.user_id ;
end if ;
end loop;
new.comment_id = r.username || count ;
return new ;
end ;
$$ language plpgsql ;

-- Trigger to handle insertion to comments table
create or replace trigger insert_comments 
before insert 
on comments 
for each row
execute procedure insert_comments_table() ;


