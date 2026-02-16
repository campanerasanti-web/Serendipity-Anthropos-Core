import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { NotificationUniversal } from '../components/NotificationUniversal';
import { NotificationUniversal as NotificationType } from '../types/notification';

describe('NotificationUniversal', () => {
  it('muestra el mensaje y marca como leído', () => {
    const notif: NotificationType = {
      id: '1',
      type: 'info',
      message: 'Mensaje de prueba',
      createdAt: new Date(),
      read: false
    };
    const onRead = jest.fn();
    const { getByText } = render(<NotificationUniversal notification={notif} onRead={onRead} />);
    fireEvent.click(getByText('Mensaje de prueba'));
    expect(onRead).toHaveBeenCalledWith('1');
  });
});
