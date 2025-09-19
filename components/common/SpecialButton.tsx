import clsx from 'clsx';
import { ClassValue } from 'clsx';
import { Link } from 'expo-router';

import { cloneElement, JSX } from 'react';
import { TouchableOpacity, Text, View, TouchableOpacityProps } from 'react-native';

interface CommonProps {
  variant?: Variant;
  style?: keyof (typeof Variants)[Variant];
  roundedType?: keyof typeof Types;
  size?: keyof typeof Sizes;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  title?: string;
}

type LinkProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = CommonProps & TouchableOpacityProps;

const Types: {
  [key: string]: ClassValue;
} = {
  roundedFull: clsx('rounded-full'),
  rounded: clsx('rounded-md'),
  square: clsx('rounded-none'),
};

type Variant = 'gray' | 'blue';

const CommonStyles = clsx(
  'flex flex-row items-center justify-center text-center gap-2',
  'text-white font-medium',
  'border-2 relative',
  'disabled:opacity-50 disabled:cursor-not-allowed'
);

const Variants: {
  [key in Variant]: {
    solid: ClassValue;
    outline: ClassValue;
  };
} = {
  blue: {
    solid: clsx(
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#6387FF] before:to-[#2956BD] before:-z-10',
      'after:absolute after:inset-0 after:bg-gradient-to-r after:from-[#4F77E8] after:to-[#0D3694] after:opacity-0 hover:after:opacity-100 after:-z-10',
      'before:transition-opacity after:transition-opacity before:duration-300 after:duration-300',
      'before:ease-in-out after:ease-in-out',
      'before:rounded-[inherit] after:rounded-[inherit]',
      'isolate overflow-hidden',
      'border-transparent'
    ),
    outline: clsx(
      'border-blue2',
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#6387FF] before:to-[#2956BD] before:-z-10 before:opacity-0',
      'text-blue2',
      'hover:text-white hover:border-transparent before:hover:opacity-100',
      'transition-all before:transition-opacity duration-300 before:duration-300',
      'before:ease-in-out',
      'before:rounded-[inherit]',
      'isolate'
    ),
  },
  gray: {
    solid: clsx(
      'bg-gray-200 dark:bg-gray-700',
      'text-gray-500 dark:text-white',
      'hover:bg-gray-300/50 dark:hover:bg-gray-700/50',
      'transition-all duration-300 ease-in-out'
    ),
    outline: clsx(
      'text-gray-500 dark:text-white',
      'border-2 dark:border-gray-700',
      'hover:bg-gray-300/50 dark:hover:bg-gray-700/50',
      'transition-all duration-300 ease-in-out'
    ),
  },
};

const Sizes: {
  [key: string]: ClassValue;
} = {
  xs: clsx('py-1 px-2', 'text-xs font-semibold'),
  sm: clsx('py-2 px-4', 'text-sm font-semibold'),
  md: clsx('py-2 px-5', 'text-base font-semibold'),
  lg: clsx('py-4 px-8', 'text-lg font-semibold'),
  xl: clsx('py-5 px-10', 'text-xl font-semibold'),
};

const IconSizes: {
  [key: string]: {
    width: number;
    height: number;
    className: string;
  };
} = {
  xs: {
    width: 12,
    height: 12,
    className: 'w-3 h-3',
  },
  sm: {
    width: 16,
    height: 16,
    className: 'w-4 h-4',
  },
  md: {
    width: 20,
    height: 20,
    className: 'w-5 h-5',
  },
  lg: {
    width: 24,
    height: 24,
    className: 'w-6 h-6',
  },
  xl: {
    width: 28,
    height: 28,
    className: 'w-7 h-7',
  },
};

export default function SpecialButton({
  variant = 'blue',
  style = 'solid',
  size = 'md',
  roundedType = 'roundedFull',
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps | LinkProps) {
  const classNames = clsx(
    CommonStyles,
    Types[roundedType],
    Variants[variant][style as keyof (typeof Variants)[Variant]],
    Sizes[size],
    props.className
  );

  if ('href' in props) {
    if (props.href?.startsWith('/')) {
      return (
        <Link {...(props as any)} className={classNames}>
          {iconLeft && (
            <Icon size={size} iconClassName={iconLeft.props?.className} iconValue={iconLeft} />
          )}
          {children}
          {iconRight && (
            <Icon size={size} iconClassName={iconRight.props.className} iconValue={iconRight} />
          )}
        </Link>
      );
    }

    return (
      <a {...(props as any)} className={classNames}>
        {iconLeft && (
          <Icon size={size} iconClassName={iconLeft.props.className} iconValue={iconLeft} />
        )}
        {children}
        {iconRight && (
          <Icon size={size} iconClassName={iconRight.props.className} iconValue={iconRight} />
        )}
      </a>
    );
  }

  return (
    <TouchableOpacity {...(props as any)} className={classNames}>
      {iconLeft && (
        <Icon size={size} iconClassName={iconLeft.props.className} iconValue={iconLeft} />
      )}
      <Text>{props.title}</Text>
      <View>{children}</View>
      {iconRight && (
        <Icon size={size} iconClassName={iconRight.props.className} iconValue={iconRight} />
      )}
    </TouchableOpacity>
  );
}

function Icon({
  size = 'md',
  iconClassName,
  iconValue,
}: {
  size: keyof typeof IconSizes;
  iconClassName: string;
  iconValue: JSX.Element;
}) {
  return cloneElement(iconValue, {
    width: IconSizes[size].width,
    height: IconSizes[size].height,
    className: clsx(IconSizes[size].className, iconClassName),
  });
}
