<template>
  <main class="flex justify-center items-center h-full">
    <div>
      <section
        class="bg-zinc-600 min-w-[300px] md:w-[500px] rounded-xl p-6 transition-all duration-300 relative"
        :class="{
          'h-[65vh]': loginIsSelected,
          'h-[75vh]': !loginIsSelected,
        }"
      >
        <div class="w-full bg-zinc-400 rounded-md h-fit">
          <button
            class="text-black rounded-md active:bg-gray-300 px-2 py-3 cursor-pointer transition-all duration-500 ease-in-out"
            :class="{
              'w-2/3 bg-white': loginIsSelected,
              'w-1/3 bg-zinc-400 hover:bg-[#9898b4] hover:text-white ':
                !loginIsSelected,
            }"
            @click="switchLogInSignUp"
          >
            Log In
          </button>
          <button
            class="text-black rounded-md active:bg-gray-300 px-2 py-3 cursor-pointer transition-all duration-500 ease-in-out"
            :class="{
              'w-2/3 bg-white': signupIsSelected,
              'w-1/3 bg-zinc-400 hover:bg-[#9898b4] hover:text-white':
                !signupIsSelected,
            }"
            @click="switchLogInSignUp"
          >
            Sign Up
          </button>
        </div>

        <div
          class="w-full text-center text-2xl text-rose-500 h-fit my-10 container"
        >
          <transition name="text-swap" mode="out-in">
            <p class="font-mono" :key="formIncommingMessage">
              {{ formIncommingMessage }}
            </p>
          </transition>
        </div>

        <!-- <label for="email" class="">Email:</label> -->
        <div class="flex flex-col items-center w-full">
          <input
            class="border-2 h-[3rem] rounded-md bg-priamry px-3 mb-6 w-full"
            type="email"
            name="email"
            placeholder="Email Address"
            v-model="email"
          />

          <!-- <label class="" for="password">Password:</label> -->
          <input
            class="border-2 h-[3rem] rounded-md bg-priamry px-3 mb-6 w-full"
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
          />
          <Transition name="newFieldComming">
            <input
              class="border-2 h-[3rem] rounded-md bg-priamry px-3 mb-6 w-full"
              v-if="signupIsSelected"
              type="password"
              name="password"
              placeholder="Repeat Password"
              v-model="passwordRepeat"
            />
          </Transition>
        </div>
        <transition name="text-swap">
          <BaseButton
            class="submitButton w-full text-2xl opacity-100 h-[4rem] transition-transform"
            :key="formSubmitButton"
            @click="submitData"
            >{{ formSubmitButton }}</BaseButton
          >
        </transition>
      </section>
    </div>
  </main>
</template>

<script>
import BaseButton from "@/components/ui/BaseButton.vue";
export default {
  data() {
    return {
      signupIsSelected: false,
      loginIsSelected: true,
      email: "",
      password: "",
      passwordRepeat: "",
      formIsValid: true,
    };
  },

  computed: {
    formIncommingMessage() {
      return this.loginIsSelected === true
        ? "Welcome Back!"
        : "Sign Up for Free";
    },
    formSubmitButton() {
      return this.loginIsSelected === true ? "LOG IN" : "GET STARTED";
    },
  },

  methods: {
    switchLogInSignUp() {
      this.loginIsSelected = !this.loginIsSelected;
      this.signupIsSelected = !this.signupIsSelected;
      console.log(this.loginIsSelected);
      console.log(this.signupIsSelected);
    },
    submitData() {
      const userInputs = {
        email: this.email,
        password: this.password,
      };
      this.$store.dispatch("signUp", userInputs);
    },
  },
};
</script>

<style scoped>
.newFieldComming-enter-active,
.newFieldComming-leave-active {
  transition: all 0.3s ease-out;
}
.newFieldComming-enter-from,
.newFieldComming-leave-to {
  max-width: 0;
  opacity: 0;
}
.newFieldComming-enter-to,
.newFieldComming-leave-from {
  max-width: 100%;
  opacity: 1;
}

.formincommingMessage-enter-active,
.formIncommingMessage-leave-active {
  transition: all 1s ease-out;
}
.formIncommingMessage-enter-from,
.formIncommingMessage-leave-to {
  /* max-width: 0; */
  opacity: 0;
}
.formIncommingMessage-enter-to,
.formIncommingMessage-leave-from {
  /* max-width: 100%; */
  opacity: 1;
}

.submitButton {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: calc(100% - 40px);
  transition: bottom 0.3s ease-out;
}

.text-swap-enter-active {
  transition: all 0.3s ease;
}

.text-swap-leave-active {
  transition: all 0.2s ease;
}

.text-swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.text-swap-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
