<template>
  <div class="sheet-wrap">
    <div class="sheet">
      <div class="quarter even-top">
        <div class="col">
          <printable-ergo-header id="odd" :plate="plate" />
          <div class="row">
            <h1 class="title">{{ $t("print.publicKey.title") }}</h1>
          </div>
          <div class="row text-center flex-grow">
            <p>
              <canvas class="inline" id="pk-canvas"></canvas>
            </p>
            <p class="key mt-4 mx-8">
              <tool-tip :label="$t('global.clickToCopy')">
                <click-to-copy :value="publicKey" />
              </tool-tip>
            </p>
          </div>
          <div class="row">
            <p class="tip-text">
              {{ $t("print.publicKey.tip") }}
            </p>
          </div>
        </div>
      </div>
      <div class="quarter odd-top">
        <div class="col">
          <printable-ergo-header id="even" :plate="plate" />
          <div class="row">
            <h1 class="title">{{ $t("print.addresses.title") }}</h1>
          </div>
          <div class="row flex-grow">
            <div
              class="flex flex-row w-full bordered mb-3 p-1"
              v-for="(address, i) in addresses"
              :key="address"
            >
              <div class="flex-grow h-auto">
                <div class="col">
                  <p class="text-gray-600 flex-grow text-sm">
                    {{ $t("print.addresses.address") }} /{{ i }}
                  </p>
                  <p class="key">
                    <tool-tip :label="$t('global.clickToCopy')">
                      <click-to-copy :value="address" />
                    </tool-tip>
                  </p>
                </div>
              </div>
              <div class="w-min h-min">
                <canvas :id="`addr-${i}-canvas`" class="m-1 inline"></canvas>
              </div>
            </div>
          </div>
          <div class="row">
            <p class="tip-text">{{ $t("print.addresses.tip") }}</p>
          </div>
        </div>
      </div>
      <div class="quarter even-bottom">
        <div class="col">
          <div class="row">
            <h1 class="title">{{ $t("print.mnemonic.title") }}</h1>
          </div>
          <div class="row flex-grow">
            <div class="mx-3 p-2 bordered">
              <p class="text-justify select-none"
                 :class="{
                   'text-lg': spacingLevel === 0,
                   'text-base': spacingLevel >= 1
                 }">
                {{ mnemonic }}
              </p>
            </div>
            <div v-if="passphrase && showPassphraseOnPrint"
                 class="bordered bg-red-50"
                 :class="spacingLevel === 3 ? 'mx-3 mt-1.5 p-1.5' : 'mx-3 mt-3 p-2'">
              <p class="font-bold text-red-700"
                 :class="spacingLevel === 3 ? 'text-xs mb-0.5' : 'text-xs mb-1'">
                ⚠️ {{ $t("print.passphrase.title") }}
              </p>
              <p class="text-justify select-none break-all"
                 :class="spacingLevel === 3 ? 'text-xs' : 'text-base'">
                {{ passphrase }}
              </p>
              <p class="text-red-600"
                 :class="spacingLevel === 3 ? 'text-xs mt-0.5' : 'text-xs mt-2'">
                {{ $t("print.passphrase.warning") }}
              </p>
            </div>
            <div v-else-if="passphrase && showPassphraseIndicator"
                 class="mx-3 bordered bg-yellow-50"
                 :class="spacingLevel === 1 ? 'mt-3 p-2' : 'mt-2 p-1.5'">
              <p class="text-xs font-semibold text-yellow-800">
                ℹ️ {{ $t("print.passphrase.indicator") }}
              </p>
            </div>
            <div v-if="passphrase && passphraseHint"
                 class="bordered bg-blue-50"
                 :class="spacingLevel === 3 ? 'mx-3 mt-1.5 p-1.5' : 'mx-3 mt-3 p-2'">
              <p class="font-semibold text-blue-700"
                 :class="spacingLevel === 3 ? 'text-xs mb-0.5' : 'text-xs mb-1'">
                💡 {{ $t("print.passphrase.hintTitle") }}
              </p>
              <p class="text-blue-900 break-all"
                 :class="spacingLevel === 3 ? 'text-xs' : 'text-sm'">
                {{ passphraseHint }}
              </p>
            </div>
          </div>
          <div class="row text-center"
               :class="{
                 'pt-5 mt-5': spacingLevel === 0,
                 'pt-3 mt-3': spacingLevel === 1,
                 'pt-2 mt-2': spacingLevel === 2,
                 'pt-1 mt-1': spacingLevel === 3
               }">
            <p class="inline-block"
               :class="spacingLevel === 0 ? 'pt-5 mt-5' : spacingLevel === 1 ? 'pt-2' : ''">
              <mdicon name="alert-outline"
                      :size="spacingLevel === 0 ? 64 : spacingLevel === 1 ? 56 : spacingLevel === 2 ? 48 : 40" />
            </p>
            <p class="mx-5"
               :class="{
                 'pb-10': spacingLevel === 0,
                 'pb-6': spacingLevel === 1,
                 'pb-4': spacingLevel === 2,
                 'pb-3': spacingLevel === 3
               }"
               v-html="$t('print.mnemonic.tip')"></p>
          </div>
          <div class="row" v-if="$te('global.translationCredits')">
            <p class="tip-text">
              {{ $t("global.translationCredits") }}
            </p>
          </div>
        </div>
      </div>
      <div class="quarter">
        <div class="col">
          <div class="row">
            <h1 class="title">{{ $t("print.instructions.title") }}</h1>
          </div>
          <div class="row flex-grow">
            <div class="mx-3 p-2 bordered">
              <p class="text-justify select-none transform rotate-y-180"
                 :class="{
                   'text-lg': spacingLevel === 0,
                   'text-base': spacingLevel >= 1
                 }">
                {{ shuffledMnemonic }}
              </p>
              <p class="text-xs tracking-normal leading-tight tip-text mt-2">
                {{ $t("print.instructions.obfuscatingMsg") }}
              </p>
            </div>
          </div>
          <div class="row leading-normal">
            <ul class="list-disc px-4">
              <li>
                {{ $t("print.instructions.bulletOne") }}
              </li>
              <li>
                {{ $t("print.instructions.bulletTwo") }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { shufflePhrase } from "@/utils/stringHelper";
import PrintableErgoHeader from "./PrintableErgoHeader.vue";
import QRCode from "qrcode";
import Mnemonic from "@/utils/ergo/mnemonic";
import { WalletChecksum } from "@emurgo/cip4-js";

export default defineComponent({
  name: "PrintWallet",
  components: {
    PrintableErgoHeader,
  },
  props: {
    strength: { type: Number, required: true },
    passphrase: { type: String, default: "" },
    showPassphraseOnPrint: { type: Boolean, default: false },
    showPassphraseIndicator: { type: Boolean, default: false },
    passphraseHint: { type: String, default: "" },
  },
  data: () => {
    return {
      mnemonic: "",
      publicKey: "",
      plate: {} as WalletChecksum,
      addresses: [] as string[],
      maxAddresses: Object.freeze(3),
    };
  },
  activated() {
    this.newWallet();
  },
  computed: {
    shuffledMnemonic() {
      return shufflePhrase(this.mnemonic);
    },
    needsCompactLayout() {
      if (!this.passphrase) return false;
      return this.showPassphraseOnPrint || this.passphraseHint;
    },
    spacingLevel() {
      if (!this.passphrase) return 0;
      if (!this.showPassphraseOnPrint && !this.showPassphraseIndicator && !this.passphraseHint) return 0;

      const hasPassphrase = this.showPassphraseOnPrint;
      const hasHint = this.passphraseHint;
      const hasIndicator = this.showPassphraseIndicator && !hasPassphrase;

      if (hasPassphrase && hasHint) return 3;
      if (hasPassphrase || hasHint) return 2;
      if (hasIndicator) return 1;

      return 0;
    },
  },
  watch: {
    strength() {
      this.newWallet();
    },
    passphrase() {
      this.deriveAddresses();
    },
  },
  methods: {
    newWallet() {
      const mnemonic = new Mnemonic(this.strength);
      this.mnemonic = mnemonic.toString();
      this.deriveAddresses();
    },
    deriveAddresses() {
      const mnemonic = new Mnemonic(this.mnemonic);

      if (this.passphrase) {
        mnemonic.setPassphrase(this.passphrase);
      }

      mnemonic.toSeed().then((seed) => {
        this.publicKey = seed.extendedPublicKey;
        this.plate = seed.checksum;

        QRCode.toCanvas(document.getElementById("pk-canvas"), seed.extendedPublicKey, {
          errorCorrectionLevel: "H",
          margin: 0,
          scale: 2.6,
        });

        this.addresses = [];
        for (let i = 0; i < this.maxAddresses; i++) {
          this.addresses.push(seed.derive(i).address);
        }

        this.$nextTick(() => {
          for (let i = 0; i < this.addresses.length; i++) {
            QRCode.toCanvas(document.getElementById(`addr-${i}-canvas`), this.addresses[i], {
              margin: 0,
              scale: 2,
            });
          }
        });
      });
    },
  },
});
</script>
