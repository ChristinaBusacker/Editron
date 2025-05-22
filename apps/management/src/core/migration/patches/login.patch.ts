import { MigrationPatch } from '../../helpers/decorators/patch.decorators';

@MigrationPatch({
  name: 'login',
  forceUpgrade: false,
  values: {
    localizations: [
      {
        key: `login.signIn`,
        en: `Sign In`,
        de: `Anmelden`,
        fr: `Se connecter`,
      },
      {
        key: `login.emailAddress`,
        en: `Email Address`,
        de: `E-Mail Adresse`,
        fr: `Adresse e-mail`,
      },
      {
        key: `login.validEmail`,
        en: `Please enter a valid email address`,
        de: `Bitte geben Sie eine gültige E-Mail-Adresse ein`,
        fr: `Veuillez entrer une adresse e-mail valide`,
      },
      {
        key: `login.password`,
        en: `Password`,
        de: `Passwort`,
        fr: `Mot de passe`,
      },
      {
        key: `login.passwordRequired`,
        en: `Password is required`,
        de: `Passwort ist erforderlich`,
        fr: `Le mot de passe est requis`,
      },
      {
        key: `login.notRegistered`,
        en: `Not registered yet? Sign up here`,
        de: `Noch nicht registriert? Hier nachholen`,
        fr: `Pas encore inscrit? Inscrivez-vous ici`,
      },
      {
        key: `login.register`,
        en: `Register`,
        de: `Registrieren`,
        fr: `S'inscrire`,
      },
      {
        key: `login.passwordRequirements`,
        en: `The password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long.`,
        de: `Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten und mindestens 8 Zeichen lang sein.`,
        fr: `Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre, et comporter au moins 8 caractères.`,
      },
      {
        key: `login.confirmPassword`,
        en: `Confirm Password`,
        de: `Passwort bestätigen`,
        fr: `Confirmer le mot de passe`,
      },
      {
        key: `login.passwordsDontMatch`,
        en: `Passwords don't match`,
        de: `Die Passwörter stimmen nicht überein`,
        fr: `Les mots de passe ne correspondent pas`,
      },
      {
        key: `login.alreadyRegistered`,
        en: `Already registered? Sign in here`,
        de: `Bereits registriert? Hier einloggen`,
        fr: `Déjà inscrit? Connectez-vous ici`,
      },
    ],
  },
})
export class LoginPatch {}
