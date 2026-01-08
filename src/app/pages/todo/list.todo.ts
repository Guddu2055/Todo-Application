
import { DeleteConceptById, GetCompositionListListener, NORMAL } from "mftsccs-browser";
import { StatefulWidget } from "mftsccs-browser";
import { getLocalUserId } from "../user/login.service";
import './todo.style.css';
import { updateContent } from "../../routes/renderRoute.service";
export class todolist extends StatefulWidget {
    todos: any;
    inpage: number = 10;
    page: number = 1;
    linker: string = "console_folder_s";


    before_render(): void {
        let userId: number = getLocalUserId();
        GetCompositionListListener("the_todo", userId, this.inpage, this.page, NORMAL).subscribe((output: any) => {
            this.todos = output;
            this.render();
        })
    }




    after_render() {
        let tableElement = this.getElementById("mainbody");
        if (tableElement) {

            if (this.todos.length > 0) {
                for (let i = 0; i < this.todos.length; i++) {
                    let id = this.todos[i].the_todo?.id;


                    // if the id is present and valid
                    if (id) {
                        let row = document.createElement("tr");
                        let col1 = document.createElement("td");
                        let col2 = document.createElement("td");
                        let col3 = document.createElement("td");
                        let col4 = document.createElement("td");
                        let title = document.createElement("span");
                        let titleValue = this.todos[i].the_todo.title
                        let descriptionValue = this.todos[i].the_todo.description
                        title.innerHTML = titleValue;
                        let description = document.createElement("span");
                        description.innerHTML = descriptionValue;
                        let edit = document.createElement("button");

                        edit.setAttribute('class', 'btn btn-primary');
                        edit.setAttribute('padding', "10px");
                        edit.id = this.todos[i].the_todo.id;
                        edit.innerHTML = "edit";

                        let del = document.createElement("button");
                        del.setAttribute('class', 'btn btn-primary');
                        del.setAttribute('padding', "10px");
                        del.id = this.todos[i].the_todo.id;
                        del.innerHTML = "Delete";
                        del.onclick = () => {
                            if (id) {
                                DeleteConceptById(id).then(() => {
                                });
                            }


                        }
                        let that = this;
                        edit.onclick = () => {
                            that.data = {
                                "id": edit.id,
                                "title": titleValue,
                                "description": descriptionValue
                            }
                            that.notify();
                            // Convert object to a string so it can travel in the URL
                            const dataString = encodeURIComponent(JSON.stringify(this.data));

                            // Navigate using the 'data' parameter
                            updateContent(`/todo-create?data=${dataString}`);
                        }

                        col1.append(title);
                        col2.append(description);
                        col3.append(del);
                        col4.append(edit);

                        row.appendChild(col1);
                        row.appendChild(col2);
                        row.appendChild(col3);
                        row.appendChild(col4);
                        tableElement.append(row);
                    }

                }
            }



        }

    }



    getHtml(): string {
        return `
  <div class="table-container">
    <div class="header-group">
        <h2>My Tasks</h2>
        <a href="/todo-create" class="btn-add">+ Add New Task</a>
    </div>
    <table class="task-table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Delete</th>
                <th>Edit</th>
            </tr>
        </thead>
        <tbody id="mainbody">
            </tbody>
    </table>
</div>`;
    }
}