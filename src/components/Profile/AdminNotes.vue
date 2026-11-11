<template>
  <div class="admin-notes-wrapper">
    <IconItem
      v-b-toggle="'admin-notes'"
      :icon="['fal', 'sticky-note']"
      class="admin-notes-title"
      :item-text="$t('profile-view.admin.admin-notes') + ' (' + notes.length + ')'"
    />

    <BCollapse :id="'admin-notes'">
      <div>
        <BAlert
          :model-value="true"
          variant="warning"
          class="text-center m-2"
        >
          {{ $t('profile-view.admin.under-construction') }}
        </BAlert>
        <div
          v-for="(note, index) in notes"
          :key="index"
          class="note"
        >
          <div class="author-img">
            <img
              :title="note.author"
              width="50"
              height="50"
              :src="note.authorImg"
            >
          </div>
          <div class="note-body">
            <div
              class="note-input"
              contenteditable
              @blur="edit(note, $event)"
            >
              {{ note.body }}
            </div>
            <div class="note-time">
              {{ note.timeSentence }}
            </div>
          </div>
          <div class="note-buttons btn-group">
            <button
              v-b-tooltip.hover.bottom="$t('profile-view.admin.remove')"
              type="button"
              class="btn btn-secondary btn-sm"
              @click="remove(index)"
            >
              <FaIcon :icon="['fal', 'trash']" />
            </button>
            <button
              v-b-tooltip.hover.bottom="$t('profile-view.admin.add-action')"
              type="button"
              class="btn btn-secondary btn-sm"
              @click="add('action')"
            >
              <FaIcon :icon="['fal', 'plus']" />
            </button>
            <button
              v-b-tooltip.hover.bottom="$t('profile-view.admin.add-reminder')"
              type="button"
              class="btn btn-secondary btn-sm"
              @click="add('reminder')"
            >
              <FaIcon :icon="['fas', 'bell']" />
            </button>
          </div>
        </div>
        <hr class="m-1">
        <!-- card card-body -->
        <div class="add-note note">
          <div class="author-img">
            <!-- <img :title="user.author" width="50" height="50" :src="user.profileImg"> -->
          </div>
          <div class="note-input new-note">
            <textarea
              rows="2"
              :placeholder="$t('profile-view.admin.post-note')"
              :value="newNote"
              @change="addNote"
            />
          </div>
        </div>
      </div>
    </BCollapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

interface Note {
  body?: string
  author?: string
  authorImg?: string
  timeSentence?: string
}

// TODO: This is not working as expected
export default defineComponent({
  name: 'AdminNotes',
  setup() {
    const notes = ref<Note[]>([])
    const newNote = ref<string>('')
    const edit = (note: Note, event: any) => {
      // only edit note if body is not empty and note body has changed.
      const noteBody = event.target.innerText
      if (noteBody !== '' && noteBody !== note.body) {
        const index = notes.value.indexOf(note)
        const newNote = { ...note, body: noteBody, timeSentence: 'Edited Now' }
        notes.value.splice(index, 1, newNote)
      }
    }
    const add = () => {}
    const addNote = (event: any) => {
      notes.value.push({
        body: event.target.value,
        timeSentence: 'Now'
      })
    }
    const remove = (index: number) => {
      notes.value.splice(index, 1)
    }

    return {
      add,
      edit,
      addNote,
      newNote,
      notes,
      remove,
    }
  },
})
</script>
<style scoped lang="scss">
.admin-notes-title {
  cursor: pointer;
  padding-bottom: 15px;
}

.admin-notes-wrapper {
  overflow: hidden;
}

.note {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 0.5rem 0;
  position: relative;
  overflow: hidden;

  .author-img img {
    border-radius: 50%;
  }
  .note-buttons {
    opacity: 0;
    right: -100px;
    position: absolute;
    bottom: 8px;
  }

  &:hover .note-buttons,
  &:focus .note-buttons {
    opacity: 0.9;
    right: 8px;
    transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
}

.note-input {
  padding: 0;
  cursor: default;
  outline: none;
  border: 3px solid transparent;
  flex: 1;
  align-items: flex-end;
  display: flex;

  &:hover,
  &:focus {
    padding: 2px;
    border: 1px solid #999;
  }

  &.new-note {
    margin: 0 10px;
    width: 100%;
    display: flex;
    border: none;
    padding: 0;
    textarea {
      flex: 1;
    }
  }
}

.note-body {
  flex: 1;
  padding-left: 7px;
  display: flex;
  flex-direction: column;

  .note-time {
    color: #999;
    font-size: 0.9em;
    padding-left: 3px;
  }
}

.btn-group {
  float: right;
}

.rtl-at-root {
  .note {
    .note-buttons {
      left: -100px;
      right: unset;
    }
    &:hover .note-buttons,
    &:focus .note-buttons {
      left: 8px;
      right: unset;
    }
  }
  .note-body {
    padding-left: unset;
    padding-right: 7px;

    .note-time {
      padding-left: unset;
      padding-right: 3px;
    }
  }
}
</style>
