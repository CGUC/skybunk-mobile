import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'native-base';
import _ from 'lodash';

import styles from '../../components/ChannelProfile/ChannelProfileStyle';

export default class ChannelProfile extends React.Component {

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  render() {
    const {
      channel: channelData,
      isModalOpen,
    } = this.props;

    if (!channelData) return null;
    if (!channelData.description) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={this.onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modal}
        >
          <View style={[styles.card, styles.cardChannelDescription]}>

            <View style={styles.cancelRow}>
              <TouchableOpacity onPress={this.onClose}>
                <Icon
                  type="EvilIcons"
                  name='close'
                  style={styles.cancelIcon}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>
              {`${channelData.name}`}
            </Text>

            <View style={styles.infoBlock}>
              {channelData.description && <Text style={styles.channelInfoText}>{`${channelData.description}`}</Text>}
            </View>

          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}