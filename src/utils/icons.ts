import type React from 'react';
import type { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

/** @expo/vector-icons MaterialCommunityIcons için geçerli ikon adı tipi. */
export type MciName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/** @expo/vector-icons Ionicons için geçerli ikon adı tipi. */
export type IonName = React.ComponentProps<typeof Ionicons>['name'];
