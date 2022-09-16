#!/bin/sh
gnome-terminal --tab --title "registry" --working-directory /home/amiar/dev/projects/talik/api/service-registry  -- /bin/bash -c "npm start;bash"
gnome-terminal --tab --title "main" --working-directory /home/amiar/dev/projects/talik/api/main-app  -- /bin/bash -c "npm start;bash"

gnome-terminal --tab --title "users" --working-directory /home/amiar//dev/projects/talik/api/users-service  -- /bin/bash -c "npm start;bash"
gnome-terminal --tab --title "comments" --working-directory /home/amiar//dev/projects/talik/api/comments-service  -- /bin/bash -c "npm start;bash"
 
  