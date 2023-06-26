----------------------------------------------------------- Deletions to Users Table ----------------------------------------------------------------------------------

-- This is handled automatically with the help of foreign key constraint of on delete cascade

----------------------------------------------------------- Deletions to Posts Table ----------------------------------------------------------------------------------

create or replace function delete_posts_table()
returns trigger 
as $$
declare
up int := 0 ;
down int := 0 ;
begin 
up := old.upvotes ;
down := old.downvotes ;
update users set upvotes = upvotes-up , downvotes = downvotes-down where old.user_id = user_id ;
return old ;
end ;
$$ language plpgsql ;

-- trigger to handle deletion on posts table
create or replace trigger delete_posts_tab
before delete 
on comments
for each row 
execute procedure delete_posts_table();

----------------------------------------------------------- Deletions to Comments Table ----------------------------------------------------------------------------------

create or replace function delete_comments_table()
returns trigger 
as $$
declare
r record ;
up int := 0 ;
down int := 0 ;
up_new int :=0 ;
down_new int :=0 ;
begin 
up := old.upvotes ;
down := old.downvotes ;
 for r in select * from users loop
 
 if old.user_id = r.user_id then 
 EXIT ;
 end if ;
 end loop ;
up_new := r.upvotes - up ;
down_new := r.upvotes - down ;
update users set upvotes = up_new , downvotes = down_new where old.user_id = user_id ;
return old ;
end ;
$$ language plpgsql ;

-- trigger to handle deletion on comments table
create or replace trigger delete_comments_tab
before delete 
on comments
for each row 
execute procedure delete_comments_table();




