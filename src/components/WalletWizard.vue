<template>
  <div class="wiz-content">
    <div class="mx-4 p-4 print:hidden">
      <div class="wiz-header">
        <wizard-header-item
          :label="$t('start.title')"
          icon="bookmark-outline"
          :step-number="1"
          :current-step="currentStep"
          position="begin"
        />
        <wizard-header-item
          :label="$t('print.title')"
          icon="printer"
          :step-number="2"
          :current-step="currentStep"
          position="end"
        />
      </div>
    </div>

    <div class="w-full h-full screen:p-10 screen:mb-20">
      <transition mode="out-in" name="fade">
        <keep-alive>
          <start-wallet v-if="at('start')" />
          <print-wallet
            v-else-if="at('print')"
            :strength="strength"
            :passphrase="passphrase"
            :show-passphrase-on-print="showPassphraseOnPrint"
            :show-passphrase-indicator="showPassphraseIndicator"
            :passphrase-hint="passphraseHint"
            ref="printWallet"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
  <div
    class="
      w-full
      p-4
      print:hidden
      fixed
      inset-x-0
      bottom-0
      bg-white
      flex
      justify-center
      shadow shadow-dark-900
    "
  >
    <div class="flex p-2 w-full lg:w-10/12 md:w-11/12 flex-wrap gap-2">
      <label class="select-control" v-if="at('print')">
        <span class="pl-1">{{ $t("print.strengthSelect.title") }}</span>
        <select v-model="strength" class="block form-select">
          <option :value="128">12 {{ $t("print.strengthSelect.words") }} (128 bits)</option>
          <option :value="160">15 {{ $t("print.strengthSelect.words") }} (160 bits)</option>
          <option :value="256">24 {{ $t("print.strengthSelect.words") }} (256 bits)</option>
        </select>
      </label>

      <label class="flex items-center" v-if="at('print')">
        <input
          type="checkbox"
          v-model="usePassphrase"
          class="form-checkbox h-5 w-5 text-blue-600"
        />
        <span class="ml-2 text-sm">{{ $t("print.passphraseToggle") }}</span>
      </label>

      <input
        v-if="at('print') && usePassphrase"
        type="text"
        v-model="passphrase"
        :placeholder="$t('print.passphrasePlaceholder')"
        class="form-input px-3 py-2 border rounded flex-grow"
        style="min-width: 200px"
      />

      <button
        v-if="at('print') && usePassphrase && passphrase"
        @click="showPassphraseOptions = !showPassphraseOptions"
        class="btn text-sm"
        type="button"
      >
        {{ showPassphraseOptions ? "−" : "+" }} {{ $t("print.passphraseOptionsToggle") }}
      </button>

      <div
        v-if="at('print') && usePassphrase && passphrase && showPassphraseOptions"
        class="w-full flex flex-wrap gap-2 p-2 bg-gray-50 rounded"
      >
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="showPassphraseOnPrint"
            @change="if (showPassphraseOnPrint) showPassphraseIndicator = false;"
            class="form-checkbox h-4 w-4 text-red-600"
          />
          <span class="ml-2 text-sm text-red-700">
            ⚠️ {{ $t("print.showPassphraseOnPrint") }}
          </span>
        </label>

        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="showPassphraseIndicator"
            @change="if (showPassphraseIndicator) showPassphraseOnPrint = false;"
            class="form-checkbox h-4 w-4 text-yellow-600"
          />
          <span class="ml-2 text-sm">{{ $t("print.showPassphraseIndicator") }}</span>
        </label>

        <input
          type="text"
          v-model="passphraseHint"
          :placeholder="$t('print.passphraseHintPlaceholder')"
          class="form-input px-3 py-2 border rounded text-sm flex-grow"
          style="min-width: 250px"
        />
      </div>

      <button class="btn" type="button" v-if="at('print')" @click="newWallet()">
        {{ $t("print.newWalletButton") }}
      </button>

      <div class="flex-auto flex flex-row-reverse">
        <button @click="nextStep()" class="btn primary" type="button">{{ nextBtnlabel }}</button>
        <button class="btn mr-4" type="button" v-if="at('print')" @click="print()">
          {{ $t("print.printButton") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WizardHeaderItem from "@/components/WizardHeaderItem.vue";
import StartWallet from "@/components/StartWallet.vue";
import PrintWallet from "@/components/print/PrintWallet.vue";
import * as consts from "@/utils/constants";

export default defineComponent({
  name: "WalletWizard",
  components: {
    WizardHeaderItem,
    StartWallet,
    PrintWallet,
  },
  data: () => {
    return {
      currentStep: 1,
      steps: ["start", "print"],
      strength: consts.defaultStrength,
      usePassphrase: false,
      passphrase: "",
      showPassphraseOptions: false,
      showPassphraseOnPrint: false,
      showPassphraseIndicator: false,
      passphraseHint: "",
    };
  },
  computed: {
    nextBtnlabel() {
      if (this.at("start")) {
        return this.$t("start.nextButton");
      }

      return this.$t("print.nextButton");
    },
  },
  watch: {
    usePassphrase(newValue) {
      if (!newValue) {
        this.passphrase = "";
        this.showPassphraseOptions = false;
        this.showPassphraseOnPrint = false;
        this.showPassphraseIndicator = false;
        this.passphraseHint = "";
      }
    },
  },
  methods: {
    at(step: string) {
      return this.steps[this.currentStep - 1] == step;
    },
    print() {
      window.print();
    },
    nextStep() {
      if (this.currentStep >= this.steps.length) {
        this.currentStep = 1;
        return;
      }

      this.currentStep++;
    },
    prevStep() {
      if (this.currentStep <= 1) {
        return;
      }

      this.currentStep--;
    },
    newWallet() {
      (this.$refs.printWallet as any).newWallet();
    },
  },
});
</script>
