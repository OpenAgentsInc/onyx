import { createNavigationContainerRef } from "@react-navigation/native"

// /**
//  * Reference to the root App Navigator.
//  *
//  * If needed, you can use this to access the navigation object outside of a
//  * `NavigationContainer` context. However, it's recommended to use the `useNavigation` hook whenever possible.
//  * @see [Navigating Without Navigation Prop]{@link https://reactnavigation.org/docs/navigating-without-navigation-prop/}
//  *
//  * The types on this reference will only let you reference top level navigators. If you have
//  * nested navigators, you'll need to use the `useNavigation` with the stack navigator's ParamList type.
//  */
export const navigationRef = createNavigationContainerRef<any>()
