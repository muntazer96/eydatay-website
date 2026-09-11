<script setup lang="ts">
import type { ProvinceItemDto, SpecializationDto } from '~/types'

const props = withDefaults(
  defineProps<{
    specializations: SpecializationDto[]
    provinces: ProvinceItemDto[]
    compact?: boolean
    initialName?: string
    initialSpec?: string | number | null
    initialProvince?: string | number | null
    submitLabel?: string
  }>(),
  {
    compact: false,
    initialName: '',
    initialSpec: null,
    initialProvince: null,
    submitLabel: 'ابحث عن طبيب',
  },
)

const emit = defineEmits<{
  submit: [payload: { name: string; specialization: number | null; province: number | null }]
}>()

const uid = useId()

const name = ref(props.initialName)
const specialization = ref<number | ''>('')
const province = ref<number | ''>('')

function selection(value: string | number | null | undefined): number | '' {
  if (value === null || value === undefined || value === '') return ''
  const id = Number(value)
  return Number.isFinite(id) ? id : ''
}

watch(() => props.initialName, (value: string) => { name.value = value }, { immediate: true })
watch(() => props.initialSpec, (value: string | number | null) => { specialization.value = selection(value) }, { immediate: true })
watch(() => props.initialProvince, (value: string | number | null) => { province.value = selection(value) }, { immediate: true })

function onSubmit() {
  emit('submit', {
    name: name.value.trim(),
    specialization: specialization.value === '' ? null : Number(specialization.value),
    province: province.value === '' ? null : Number(province.value),
  })
}
</script>

<template>
  <form class="search-form" :class="{ 'search-form--compact': compact }" role="search" @submit.prevent="onSubmit">
    <div class="search-form__field search-form__field--grow">
      <BaseIcon class="search-form__search-icon" name="magnify" :size="22" />
      <input
        v-model="name"
        type="text"
        class="search-form__input"
        placeholder="ابحث باسم الطبيب أو الاختصاص"
        aria-label="ابحث باسم الطبيب أو الاختصاص"
        :id="`search-name-${uid}`"
      />
    </div>

    <div class="search-form__field">
      <label class="sr-only" :for="`search-spec-${uid}`">الاختصاص</label>
      <SearchAutocomplete :id="`search-spec-${uid}`" v-model="specialization" :options="specializations" label="الاختصاص" placeholder="كل التخصصات" />
    </div>

    <div class="search-form__field">
      <label class="sr-only" :for="`search-prov-${uid}`">المحافظة</label>
      <SearchAutocomplete :id="`search-prov-${uid}`" v-model="province" :options="provinces" label="المحافظة" placeholder="كل المحافظات" />
    </div>

    <button type="submit" class="btn btn--primary btn--lg">
      {{ submitLabel }}
      <BaseIcon name="magnify" :size="20" />
    </button>
  </form>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.search-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-md);
  width: 100%;
}

.search-form__field {
  min-width: 0;
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1.5px solid rgba(15, 143, 129, 0.15);
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 20px rgba(15, 58, 63, 0.05);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-form__field:focus-within {
  z-index: 40;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 143, 129, 0.14), 0 12px 26px rgba(15, 58, 63, 0.08);
}

.search-form__field--grow {
  flex: 1;
}

.search-form__search-icon {
  position: absolute;
  inset-inline-start: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-form__input {
  min-width: 0;
  width: 100%;
  min-height: 54px;
  padding: 0 48px 0 16px;
  border: 0;
  background: transparent;
  color: var(--color-text);
  font-size: 16px;
}

.search-form__input::placeholder {
  color: var(--color-text-muted);
}

.search-form__input:focus {
  outline: none;
}

.search-form .btn {
  min-height: 54px;
}

@media (min-width: 768px) {
  .search-form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .search-form__field--grow {
    grid-column: 1 / -1;
  }

  .search-form .btn {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .search-form {
    grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(0, 1fr)) auto;
  }

  .search-form__field--grow,
  .search-form .btn {
    grid-column: auto;
  }
}
</style>
