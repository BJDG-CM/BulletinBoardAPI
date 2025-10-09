import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // 최소 8자 이상
          if (value.length < 8) return false;

          // 영문 대문자 포함 여부
          const hasUpperCase = /[A-Z]/.test(value);
          // 영문 소문자 포함 여부
          const hasLowerCase = /[a-z]/.test(value);
          // 숫자 포함 여부
          const hasNumber = /[0-9]/.test(value);
          // 특수문자 포함 여부
          const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

          return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Error!: 비밀번호는 최소 8자 이상이며, 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
        },
      },
    });
  };
}