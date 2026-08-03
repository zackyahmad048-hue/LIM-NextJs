import {
  BaseEntity,
  type BaseEntityProps,
} from "@/modules/shared/domain/base.entity";

export interface SettingProps extends BaseEntityProps {
  key: string;
  value: string;
  type: string;
  description: string | null;
}

export class Setting extends BaseEntity<SettingProps> {
  private constructor(props: SettingProps) {
    super(props);
  }

  get key(): string {
    return this.props.key;
  }

  get value(): string {
    return this.props.value;
  }

  get type(): string {
    return this.props.type;
  }

  get description(): string | null {
    return this.props.description;
  }

  static create(props: SettingProps): Setting {
    return new Setting(props);
  }
}
