// src/app/pages/example/wrapper.example.ts
import { StatefulWidget } from 'mftsccs-browser';
import { todolist } from './list.todo';
import { todocreate } from './create.todo';
import './todo.style.css';

export class Todo extends StatefulWidget {
    mount_child() {
        const widget1 = this.getElementById("widget1");
        const widget2 = this.getElementById("widget2");

        const creating = new todocreate();
        const listing = new todolist();

        if (widget1) {
            this.childWidgets.push(creating);
            creating.mount(widget1);
        }

        if (widget2) {
            // This is the bridge: when list notifies, update create form
            listing.dataChange((value: any) => {
                this.UpdateChildData(value, creating);
            });
            this.childWidgets.push(listing);
            listing.mount(widget2);
        }
    }

    getHtml(): string {
        return `
            <div class="todo-wrapper">
                <div id="widget1" class="form-section"></div>
                <div id="widget2" class="list-section"></div>
            </div>`;
    }
}