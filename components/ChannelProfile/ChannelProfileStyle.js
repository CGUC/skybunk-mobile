import { StyleSheet, Dimensions } from 'react-native';

import userProfileStyles from '../../components/UserProfile/UserProfileStyle'

export default (styles = StyleSheet.create({
    modal: {
        ...userProfileStyles.modal
    },
    card: {
        ...userProfileStyles.card
    },
    cancelRow: {
        ...userProfileStyles.cancelRow
    },
    cancelIcon: {
        ...userProfileStyles.cancelIcon
    },
    name: {
        ...userProfileStyles.name
    },
    infoBlock: {
        ...userProfileStyles.infoBlock,
    },
    cardChannelDescription: {
        height: 200
    },
    channelInfoText: {
        textAlign: 'center'
    }
}));