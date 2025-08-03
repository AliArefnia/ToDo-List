<template>
  <main class="flex justify-center items-center h-full">
    <div>
      <section
        class="bg-zinc-600 min-w-[300px] w-[95vw] md:w-[500px] rounded-xl p-6 transition-all duration-300 relative"
        :class="{
          'h-[475px]': loginIsSelected,
          'h-[535px]': !loginIsSelected,
        }"
      >
        <div class="w-full bg-zinc-400 rounded-md h-fit">
          <button
            class="text-black text-lg rounded-md active:bg-gray-300 px-2 py-4 cursor-pointer transition-all duration-500 ease-in-out"
            :class="{
              'w-2/3 bg-white': loginIsSelected,
              'w-1/3 bg-zinc-400 hover:bg-[#9898b4] hover:text-white ':
                !loginIsSelected,
            }"
            @click.stop="switchLogInSignUp('logIn')"
          >
            Log In
          </button>
          <button
            class="text-black text-lg rounded-md active:bg-gray-300 px-2 py-4 cursor-pointer transition-all duration-500 ease-in-out"
            :class="{
              'w-2/3 bg-white': signupIsSelected,
              'w-1/3 bg-zinc-400 hover:bg-[#9898b4] hover:text-white':
                !signupIsSelected,
            }"
            @click.stop="switchLogInSignUp('signUp')"
          >
            Sign Up
          </button>
        </div>

        <div class="w-full text-center text-2xl h-fit my-8 container">
          <transition name="text-swap" mode="out-in">
            <p :key="formIncommingMessage" class="font-mono text-rose-500">
              {{ formIncommingMessage }}
            </p>
          </transition>
          <transition name="text-swap" mode="out-in">
            <p :key="formGuideMessage.guide" class="font-mono text-sm">
              {{ formGuideMessage.message }}
              <span
                class="text-rose-500 cursor-pointer"
                @click="switchLogInSignUp(formGuideMessage.page)"
              >
                {{ formGuideMessage.guide }}</span
              >
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
            v-focus
          />

          <!-- <label class="" for="password">Password:</label> -->
          <input
            class="border-2 h-[3rem] rounded-md bg-priamry px-3 mb-6 w-full"
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
            @keyup.enter="submitData"
          />
          <transition name="text-swap">
            <p
              v-if="loginIsSelected"
              to="ResetPassword"
              class="text-rose-500 self-end font-mono text-sm md:text-md -mt-4 cursor-pointer mb-1"
              @click="resetPassword"
            >
              Forget password?
            </p>
          </transition>
          <Transition name="newFieldComming">
            <input
              class="border-2 h-[3rem] rounded-md bg-priamry px-3 mb-6 w-full"
              v-if="signupIsSelected"
              type="password"
              name="password"
              placeholder="Repeat Password"
              v-model="passwordRepeat"
              @keyup.enter="submitData"
            />
          </Transition>
          <transition name="text-swap">
            <p
              v-if="!!this.error"
              class="text-rose-500 self-start font-mono text-md md:text-lg font-bold"
            >
              {{ errorMessage }}
            </p>
          </transition>
        </div>
        <transition name="text-swap">
          <BaseButton
            class="submitButton w-full text-lg opacity-100 h-[4rem] transition-transform"
            :key="formSubmitButton"
            @click="submitData"
            @keyup.enter="submitData"
            >{{ formSubmitButton }}</BaseButton
          >
        </transition>
      </section>
    </div>
  </main>
</template>

<script>
import BaseButton from "@/components/ui/BaseButton.vue";
import validatePassword from "@/helpers/ValidatePassword";
import validateEmail from "@/helpers/ValidateEmailAddress";
import { nextTick } from "vue";
export default {
  data() {
    return {
      signupIsSelected: false,
      loginIsSelected: true,
      email: "",
      password: "",
      passwordRepeat: "",
      formIsValid: true,
      isLoading: false,
      error: null,
    };
  },

  computed: {
    formIncommingMessage() {
      return this.loginIsSelected === true
        ? "Welcome Back!"
        : "Sign Up for Free";
    },

    formGuideMessage() {
      return this.loginIsSelected === true
        ? {
            message: "don't have an account?",
            guide: "Sign Up",
            page: "signUp",
          }
        : {
            message: "already have an account?",
            guide: "Log In",
            page: "logIn",
          };
    },

    formSubmitButton() {
      return this.loginIsSelected === true ? "LOG IN" : "GET STARTED";
    },
    errorMessage() {
      switch (this.error) {
        case "INVALID_LOGIN_CREDENTIALS":
          return "Email or Password is Wrong!";
          break;
        case "Email is Invalid!":
          return "Enter a valid email!";
          break;
        case "Password is Invalid!":
          return "Enter a Valid Password!";
          break;
        case "Failed to fetch":
          return "Failed to fetch! try again.";
          break;
        case "WEAK_PASSWORD : Password should be at least 6 characters":
          return "Password should be at least 6 characters";
          break;
        case "EMAIL_EXISTS":
          return "This email already exists!";
          break;
        case "Conflict password repeat":
          return "Password repeat doesn't match!";
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          return "too many attemps, try later!";
          break;
        case "signal is aborted without reason":
          return "Please check your VPN or internet connection";
          break;
      }
    },
  },

  methods: {
    switchLogInSignUp(form) {
      if (form === "signUp") {
        this.loginIsSelected = false;
        this.signupIsSelected = true;
      }
      if (form === "logIn") {
        this.loginIsSelected = true;
        this.signupIsSelected = false;
      }

      this.error = "";
    },

    async resetPassword() {
      this.error = "";
      await nextTick();
      if (!validateEmail(this.email)) {
        this.error = "Email is Invalid!";
        return;
      }

      const userEmail = {
        email: this.email,
      };
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: this.email,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.error?.message || "Failed to Create Task"
        );
        throw error;
      }

      this.$router.replace("/ResetPassword");
      // this.$store.dispatch("resetPassword",userEmail)
    },

    async submitData() {
      this.error = "";
      await nextTick();
      if (!validateEmail(this.email)) {
        this.error = "Email is Invalid!";
        return;
      }
      if (!validatePassword(this.password)) {
        this.error = "Password is Invalid!";
        return;
      }
      if (this.signupIsSelected) {
        if (this.password !== this.passwordRepeat) {
          this.error = "Conflict password repeat";
          return;
        }
      }

      const userInputs = {
        email: this.email,
        password: this.password,
      };
      this.isLoading = true;
      this.error = null;
      try {
        if (this.loginIsSelected) {
          await this.$store.dispatch("logIn", userInputs);
        }
        if (this.signupIsSelected) {
          await this.$store.dispatch("signUp", userInputs);
        }
        this.$router.replace("/");
      } catch (error) {
        this.error = error.message || "Failed to Auth";
      }
      this.isLoading = false;
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
