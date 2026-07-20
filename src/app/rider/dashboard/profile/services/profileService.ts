import { api } from '../../../../../lib/api';

import {
  RiderProfile,
  UpdateProfileRequest,
  UpdateBankRequest,
} from '../types';

class RiderProfileService {
  /*
   * Get Rider Profile
   */
  async getProfile() {
    const { data } =
      await api.get<RiderProfile>(
        '/rider/profile',
      );

    return data;
  }

  /*
   * Update Profile
   */
  async updateProfile(
    payload: UpdateProfileRequest,
  ) {
    const { data } =
      await api.patch<RiderProfile>(
        '/rider/profile',
        payload,
      );

    return data;
  }

  /*
   * Update Bank Details
   */
  async updateBank(
    payload: UpdateBankRequest,
  ) {
    const { data } =
      await api.patch<RiderProfile>(
        '/rider/profile/bank',
        payload,
      );

    return data;
  }

  async updateAvailability(
  isOnline: boolean,
) {
  const { data } = await api.patch(
    '/rider/profile/availability',
    {
      isOnline,
    },
  );

  return data;
}
}

export default new RiderProfileService();