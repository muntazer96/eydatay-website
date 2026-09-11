<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps<{
  id: string
  modelValue: number | ''
  options: { id: number; name: string }[]
  label: string
  placeholder: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: number | ''] }>()
const query = ref('')
const opened = ref(false)
const editing = ref(false)
const active = ref(-1)
const input = ref<HTMLInputElement | null>(null)
const list = ref<HTMLUListElement | null>(null)
const selectedLabel = computed(() => props.options.find((item) => item.id === props.modelValue)?.name ?? '')
const normalize = (value: string) => value.trim().replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').toLowerCase()
const matches = computed(() => props.options.filter((item) => !editing.value || normalize(item.name).includes(normalize(query.value))))
watch(selectedLabel, (value) => { if (!editing.value) query.value = value }, { immediate: true })

function open() {
  opened.value = true
  active.value = -1
}
function type(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  editing.value = true
  opened.value = true
  active.value = -1
}
function choose(item: { id: number; name: string }) {
  emit('update:modelValue', item.id)
  query.value = item.name
  editing.value = false
  opened.value = false
  active.value = -1
}
function clear() {
  emit('update:modelValue', '')
  query.value = ''
  editing.value = false
  input.value?.focus()
  open()
}
function close() {
  if (editing.value) {
    const exact = props.options.find((item) => normalize(item.name) === normalize(query.value))
    if (exact) choose(exact)
    else if (!query.value.trim()) emit('update:modelValue', '')
    else query.value = selectedLabel.value
  }
  editing.value = false
  opened.value = false
  active.value = -1
}
async function move(step: number) {
  if (!opened.value) open()
  active.value = Math.max(0, Math.min(matches.value.length - 1, active.value < 0 && step < 0 ? matches.value.length - 1 : active.value + step))
  await nextTick()
  list.value?.children[active.value]?.scrollIntoView({ block: 'nearest' })
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    void move(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' && opened.value) {
    event.preventDefault()
    const item = matches.value[active.value >= 0 ? active.value : 0]
    if (item) choose(item)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    editing.value = false
    query.value = selectedLabel.value
    close()
  }
}
</script>

<template>
  <div class="autocomplete">
    <input :id="id" ref="input" :value="query" :placeholder="placeholder" :aria-label="label" role="combobox" aria-autocomplete="list" :aria-expanded="opened" :aria-controls="`${id}-options`" :aria-activedescendant="opened && active >= 0 && matches[active] ? `${id}-option-${active}` : undefined" autocomplete="off" @input="type" @focus="open" @click="open" @blur="close" @keydown="keydown" />
    <button v-if="query || modelValue !== ''" type="button" class="autocomplete__action" :aria-label="`مسح ${label}`" :title="`مسح ${label}`" @mousedown.prevent @click="clear"><BaseIcon name="close" :size="18" /></button>
    <BaseIcon v-else name="magnify" :size="18" class="autocomplete__hint" />
    <ul v-if="opened" :id="`${id}-options`" ref="list" role="listbox" :aria-label="label" class="autocomplete__options">
      <li v-for="(item, index) in matches" :id="`${id}-option-${index}`" :key="item.id" role="option" :aria-selected="item.id === modelValue" :class="{ active: index === active }" @mousedown.prevent @click="choose(item)">
        <span>{{ item.name }}</span><BaseIcon v-if="item.id === modelValue" name="check" :size="18" />
      </li>
      <li v-if="!matches.length" class="autocomplete__empty" role="presentation">لا توجد نتائج مطابقة</li>
    </ul>
  </div>
</template>

<style scoped>
.autocomplete { position: relative; width: 100%; min-width: 0; color: var(--color-text); }
.autocomplete input { width: 100%; min-width: 0; min-height: 54px; border: 0; border-radius: 8px; padding: 10px 14px; padding-inline-end: 42px; font-size: 16px; color: var(--color-text); background: transparent; }
.autocomplete input:focus { outline: none; }
.autocomplete__action, .autocomplete__hint { position: absolute; inset-inline-end: 8px; top: 50%; transform: translateY(-50%); }
.autocomplete__action { display: grid; place-items: center; width: 32px; height: 36px; border: 0; border-radius: 4px; background: transparent; color: var(--color-text-secondary); }
.autocomplete__action:hover { background: var(--color-primary-soft); }
.autocomplete__hint { pointer-events: none; margin-inline-end: 8px; color: var(--color-text-muted); }
.autocomplete__options { position: absolute; z-index: 30; inset-inline: 0; top: calc(100% + 6px); max-height: 240px; overflow-y: auto; overscroll-behavior: contain; list-style: none; margin: 0; padding: 6px; border: 1px solid var(--color-border); border-radius: 8px; background: #fff; box-shadow: var(--shadow-lg); }
.autocomplete__options li { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 44px; padding: 8px; border-radius: 4px; cursor: pointer; overflow-wrap: anywhere; }
.autocomplete__options li.active, .autocomplete__options li:hover, .autocomplete__options li[aria-selected='true'] { background: var(--color-primary-soft); color: var(--color-primary-dark); }
.autocomplete__options .autocomplete__empty { font-size: 14px; color: var(--color-text-muted); cursor: default; }
</style>
