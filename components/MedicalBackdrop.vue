<template>
  <div class="medical-backdrop" aria-hidden="true">
    <span class="medical-symbol medical-symbol--tooth">
      <BaseIcon name="tooth-outline" :size="36" />
    </span>
    <span class="medical-symbol medical-symbol--heart">
      <BaseIcon name="heart-pulse" :size="42" />
    </span>
    <span class="medical-symbol medical-symbol--bone">
      <BaseIcon name="bone" :size="38" />
    </span>
    <span class="medical-symbol medical-symbol--doctor">
      <BaseIcon name="doctor" :size="40" />
    </span>
    <span class="medical-symbol medical-symbol--pill">
      <BaseIcon name="pill" :size="34" />
    </span>
    <span class="medical-symbol medical-symbol--stethoscope">
      <BaseIcon name="stethoscope" :size="44" />
    </span>
    <span class="medical-symbol medical-symbol--brain">
      <BaseIcon name="brain" :size="38" />
    </span>
    <span class="medical-symbol medical-symbol--microscope">
      <BaseIcon name="microscope" :size="36" />
    </span>
  </div>
</template>

<style scoped>
.medical-backdrop {
  position: fixed;
  inset: var(--header-height) 0 0;
  z-index: 1090;
  overflow: hidden;
  pointer-events: none;
}

.medical-symbol {
  position: absolute;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border: 1px solid rgba(15, 143, 129, 0.12);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.36);
  color: rgba(15, 143, 129, 0.15);
  box-shadow: 0 16px 38px rgba(6, 76, 82, 0.05);
  backdrop-filter: blur(2px);
  animation: medicalFloat var(--float-duration, 13s) ease-in-out var(--float-delay, 0s) infinite;
  will-change: transform;
}

.medical-symbol--tooth {
  top: 7%;
  left: 2.4%;
  --float-duration: 12s;
  --float-delay: -3s;
}

.medical-symbol--heart {
  top: 22%;
  right: 2.2%;
  width: 82px;
  height: 82px;
  --float-duration: 14s;
  --float-delay: -8s;
}

.medical-symbol--bone {
  top: 43%;
  left: 3.8%;
  transform: rotate(-12deg);
  --float-duration: 15s;
  --float-delay: -5s;
}

.medical-symbol--doctor {
  top: 62%;
  right: 3.4%;
  --float-duration: 13s;
  --float-delay: -1s;
}

.medical-symbol--pill {
  top: 79%;
  left: 7%;
  width: 62px;
  height: 62px;
  --float-duration: 11s;
  --float-delay: -6s;
}

.medical-symbol--stethoscope {
  top: 88%;
  right: 8%;
  width: 86px;
  height: 86px;
  --float-duration: 16s;
  --float-delay: -10s;
}

.medical-symbol--brain {
  top: 36%;
  right: 13%;
  width: 66px;
  height: 66px;
  --float-duration: 14.5s;
  --float-delay: -4s;
}

.medical-symbol--microscope {
  top: 69%;
  left: 15%;
  width: 68px;
  height: 68px;
  --float-duration: 12.5s;
  --float-delay: -9s;
}

@keyframes medicalFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(-3deg);
  }
  35% {
    transform: translate3d(10px, -18px, 0) rotate(4deg);
  }
  70% {
    transform: translate3d(-7px, -8px, 0) rotate(-1deg);
  }
}

@media (max-width: 900px) {
  .medical-symbol {
    width: 58px;
    height: 58px;
    border-radius: 19px;
    opacity: 0.72;
  }

  .medical-symbol--brain,
  .medical-symbol--microscope {
    display: none;
  }
}

@media (max-width: 600px) {
  .medical-symbol--bone,
  .medical-symbol--doctor,
  .medical-symbol--stethoscope {
    display: none;
  }

  .medical-symbol--tooth,
  .medical-symbol--pill {
    left: -14px;
  }

  .medical-symbol--heart {
    right: -12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .medical-symbol {
    animation: none;
  }
}
</style>
