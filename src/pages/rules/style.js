import styled from 'styled-components'

export const RuleWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  background: linear-gradient(270deg, #d0eaff 0%, #fcf0ff 100%);
  padding-top: 120px;
  padding-bottom: 100px;
  overflow: hidden;
  @media screen and (max-width: 1152px) {
    padding-top: 70px;
  }
`
export const RuleContentWrapper = styled.div``
export const RuleBlockWrapper = styled.div`
  width: 100%;
  margin-top: ${(props) => props.marginTop || 0}px;
  .content {
    text-align: center;
    width: 63%;
    margin: 0 auto;
  }

  h1 {
    font-size: 60px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 84px;
  }

  h2 {
    font-size: 40px;
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 600;
    color: #000000;
    line-height: 56px;
  }
  h3 {
    font-size: 24px;
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 300;
    color: #000000;
    line-height: 33px;
    text-align: left;
  }
  h5 {
    font-size: 24px;
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 100;
    color: #6d7278;
    line-height: 33px;
    text-align: left;
  }

  p {
    font-size: 24px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: #000000;
    line-height: 33px;
    text-align: left;
  }

  li {
    font-size: 20px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: #6d7278;
    line-height: 28px;
    text-align: left;
  }

  .picture_content {
    background: url(${(props) => props.itemBg}) no-repeat center bottom;
    background-size: 100% 100%;
    text-align: center;
    padding-top: 36px;
    padding-bottom: 36px;
    h2 {
      font-size: 40px;
      font-family: PingFangTC-Semibold, PingFangTC;
      font-weight: 600;
      color: #ffffff;
      line-height: 56px;
    }
  }
  .box {
    display: flex;
    justify-content: center;
    margin-left: 10%;
    margin-right: 10%;
    gap: 5%;

    .item {
      border-radius: 8px 8px 0px 8px;
      margin-top: 80px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        margin-bottom: 30px;
      }

      p {
        font-size: 24px;
        font-family: PingFangTC-Medium, PingFangTC;
        font-weight: 500;
        color: #ffffff;
        line-height: 33px;
      }

      b {
        color: #000;
      }

      &::before {
        content: '';
        display: inline-block;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background-color: #377db8;

        position: absolute;
        top: 15px;
        left: 0;
      }
    }
  }

  @media screen and (max-width: 1152px) {
    .content {
      width: 90%;
    }

    h1 {
      font-size: 45px;
      font-weight: 500;
      line-height: 60px;
    }

    h2 {
      font-size: 30px;
      font-weight: 500;
      line-height: 42px;
    }
    h3 {
      font-size: 18px;
      font-weight: 200;
      line-height: 24px;
    }
    h5 {
      font-size: 18px;
      font-weight: 100;
      line-height: 24px;
    }

    p {
      font-size: 18px;
      font-weight: 300;
      line-height: 24px;
    }

    li {
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
    }

    .picture_content {
      h2 {
        font-size: 30px;
        font-weight: 500;
        line-height: 42px;
      }
    }
    .box {
      display: flex;
      flex-wrap: wrap;
      .item {
        p {
          font-size: 18px;
          font-weight: 400;
          line-height: 24px;
        }
      }
    }
  }
`
