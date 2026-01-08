

import { CreateTheConnectionLocal, LocalSyncData, MakeTheInstanceConceptLocal, PatcherStructure, PRIVATE, UpdateComposition } from "mftsccs-browser";
import { StatefulWidget } from "mftsccs-browser";
import './todo.style.css';
import { getLocalUserId } from "../user/login.service";
import { updateContent } from "../../routes/renderRoute.service";

export class todocreate extends StatefulWidget {

    after_render(): void {
        // existing URL param logic 
        const urlParams = new URLSearchParams(window.location.search);
        const rawData = urlParams.get('data');
        if (rawData) {
            const editData = JSON.parse(decodeURIComponent(rawData));
            this.data = editData;
        }
        let userId: number = getLocalUserId();
        let order: number = 1;
        let title = this.getElementById("title") as HTMLInputElement;
        let description = this.getElementById("description") as HTMLInputElement;
        let id = this.getElementById("id") as HTMLInputElement;
        if (this.data) {
            title.value = this.data.title;
            description.value = this.data.description;
            id.value = this.data.id;
        };

        let submitButton = this.getElementById("submit");
        if (submitButton) {
            submitButton.onclick = async (ev: Event) => {
                ev.preventDefault();


                submitButton.innerText = "Saving...";

                if (id.value) {
                    // update Logic
                    let patcherStructure: PatcherStructure = new PatcherStructure();
                    patcherStructure.compositionId = Number(id.value);
                    patcherStructure.patchObject = {
                        "title": title.value,
                        "description": description.value
                    }

                    await UpdateComposition(patcherStructure);
                } else {
                    // create Logic Parallelized
                    try {
                        const mainconcept = await MakeTheInstanceConceptLocal("the_todo", "", true, userId, PRIVATE);

                        // create title and description at the same time
                        const [concept, concept2] = await Promise.all([
                            MakeTheInstanceConceptLocal("title", title.value, false, userId, PRIVATE),
                            MakeTheInstanceConceptLocal("description", description.value, false, userId, PRIVATE)
                        ]);

                        // create connections at the same time
                        await Promise.all([
                            CreateTheConnectionLocal(mainconcept.id, concept.id, mainconcept.id, order, "", userId),
                            CreateTheConnectionLocal(mainconcept.id, concept2.id, mainconcept.id, order, "", userId)
                        ]);

                        await LocalSyncData.SyncDataOnline();
                    } catch (error) {
                        console.error("Creation failed", error);
                    }
                }
                await updateContent(`/todo-list`);
            }
        }
    }






    getHtml(): string {
        let html = "";
        html = `<div class="container">
    <h1>Create Task</h1>
    <form id="todo-form">
        <input type="number" id="id" hidden>
        
        <div class="form-group">
            <label for="title">title</label>
            <input type="text" id="title" placeholder="title">
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" rows="6" placeholder="description"></textarea>
        </div>

        <div class="button-row">
            <button class=" btn btn-primary" id="submit" type=submit>Submit</button>
            <a href="/todo-list" class=" btn btn-primary">Back</a>
        </div>
    </form>
</div>`
        return html;
    }
}