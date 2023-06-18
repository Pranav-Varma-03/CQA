----------------------------------------------------------- Update to Posts Table ----------------------------------------------------------------------------------
create or replace function update_post()
returns trigger 
as $$
declare 
begin 
if old.tags <> new.tags or old.body <> new.body or old.title <> new.title then 
	new.edit_status = 1 ;
else 
	new.edit_status = 0 ;
end if ;
return new ;
end ;
$$ language plpgsql ;

-- This trigger is called when a post is edited based on that edit status value is set
create or replace trigger update_to_post 
before update
on posts
for each row 
execute procedure update_post();

----------------------------------------------------------- Update to Comments Table -------------------------------------------------------------------------------
create or replace function update_comment()
returns trigger 
as $$
declare 
begin 
if old.body <> new.body then 
	new.editstatus = 1 ;
else 
	new.editstatus = 0 ;
end if ;
return new ;
end ;
$$ language plpgsql ;

-- This trigger is called when a comment is edited based on that edit status value is set
create or replace trigger update_to_comment
before update
on comments
for each row 
execute procedure update_comment();

