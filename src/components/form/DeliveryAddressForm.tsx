import React, { memo } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { DELIVERY_ZONES } from '../../constants/deliveryZones';

interface DeliveryFormData {
    deliveryZone?: string;
    street?: string;
    houseNumber?: string;
    postcode?: string;
}

interface DeliveryAddressFormProps {
    register: UseFormRegister<DeliveryFormData>;
    errors: FieldErrors<DeliveryFormData>;
}

/**
 * Form fields for delivery address including zone selection, street, house number, and postcode.
 */
const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = memo(({
    register,
    errors
}) => {
    return (
        <>
            {/* Delivery Zone Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                    Liefergebiet
                </label>
                <select
                    {...register('deliveryZone')}
                    className="w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white"
                >
                    <option value="">Bitte wählen...</option>
                    {Object.entries(DELIVERY_ZONES).map(([key, zone]) => (
                        <option key={key} value={key}>
                            {zone.label} (Min. {zone.minOrder.toFixed(2).replace('.', ',')} €, +{zone.fee.toFixed(2).replace('.', ',')} € Liefergebühr)
                        </option>
                    ))}
                </select>
                {errors.deliveryZone && (
                    <p className="text-xs text-red-600">
                        {errors.deliveryZone.message}
                    </p>
                )}
            </div>

            {/* Address Fields */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                    Lieferadresse
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <input
                            type="text"
                            {...register('street')}
                            className="w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white"
                            placeholder="Straße"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            {...register('houseNumber')}
                            className="w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white"
                            placeholder="Nr."
                        />
                    </div>
                    <div className="col-span-2">
                        <input
                            type="text"
                            {...register('postcode')}
                            className="w-full rounded-lg border border-gray-300 focus:border-light-blue-400 focus:ring-1 focus:ring-light-blue-400 p-2.5 text-sm bg-white"
                            placeholder="Postleitzahl"
                        />
                    </div>
                </div>
            </div>
        </>
    );
});

DeliveryAddressForm.displayName = 'DeliveryAddressForm';

export default DeliveryAddressForm;
